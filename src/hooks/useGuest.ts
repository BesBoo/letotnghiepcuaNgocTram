import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Guest } from '../lib/supabase';
import config from '../invitation.config';

function getGuestParams(): {
  slug: string;
  directName?: string;
  directGreeting?: string;
  directStart?: string;
  directEnd?: string;
} {
  if (typeof window === 'undefined') return { slug: '' };

  const searchParams = new URLSearchParams(window.location.search);

  // 1. Check query parameters: ?to=..., ?guest=..., ?id=..., ?gui=..., ?u=...
  const paramSlug =
    searchParams.get('to') ||
    searchParams.get('guest') ||
    searchParams.get('id') ||
    searchParams.get('gui') ||
    searchParams.get('u');

  const directName = searchParams.get('name') || searchParams.get('ten') || undefined;
  const directGreeting =
    searchParams.get('greeting') || searchParams.get('xungho') || undefined;
  const directStart =
    searchParams.get('start') || searchParams.get('batdau') || searchParams.get('time') || undefined;
  const directEnd =
    searchParams.get('end') || searchParams.get('ketthuc') || undefined;

  if (paramSlug) {
    return {
      slug: decodeURIComponent(paramSlug).trim(),
      directName: directName ? decodeURIComponent(directName).trim() : undefined,
      directGreeting: directGreeting ? decodeURIComponent(directGreeting).trim() : undefined,
      directStart: directStart ? decodeURIComponent(directStart).trim() : undefined,
      directEnd: directEnd ? decodeURIComponent(directEnd).trim() : undefined,
    };
  }

  if (directName) {
    return {
      slug: decodeURIComponent(directName).trim(),
      directName: decodeURIComponent(directName).trim(),
      directGreeting: directGreeting ? decodeURIComponent(directGreeting).trim() : undefined,
      directStart: directStart ? decodeURIComponent(directStart).trim() : undefined,
      directEnd: directEnd ? decodeURIComponent(directEnd).trim() : undefined,
    };
  }

  // 2. Check path: /tuan-anh, /1, /gui/chi-lan
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!pathname) return { slug: '' };

  const segments = pathname.split('/');
  const lastSegment = segments[segments.length - 1];

  // Avoid assets or files with extensions
  if (lastSegment && !lastSegment.includes('.')) {
    return { slug: decodeURIComponent(lastSegment).trim() };
  }

  return { slug: '' };
}

export function useGuest() {
  const [slug, setSlug] = useState<string>('');
  const [guest, setGuest] = useState<Guest>({
    slug: '',
    name: config.senderName,
    greeting: config.senderGreeting,
    custom_message: config.invitationText[0],
    has_opened: false,
    rsvp_status: 'pending',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { slug: urlSlug, directName, directGreeting, directStart, directEnd } = getGuestParams();
    setSlug(urlSlug);

    if (!urlSlug && !directName) {
      setLoading(false);
      return;
    }

    const fallbackName =
      directName ||
      urlSlug
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    const fallbackGreeting = directGreeting || `Gửi bạn ${fallbackName},`;

    if (!isSupabaseConfigured || !supabase) {
      setGuest({
        slug: urlSlug,
        name: fallbackName,
        greeting: fallbackGreeting,
        custom_message: config.invitationText[0],
        start_time: directStart,
        end_time: directEnd,
        has_opened: false,
        rsvp_status: 'pending',
      });
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchGuest() {
      try {
        setLoading(true);
        // Try query by slug first
        let { data, error } = await supabase!
          .from('guests')
          .select('*')
          .eq('slug', urlSlug)
          .maybeSingle();

        // If not found and urlSlug is a number, try query by id
        if (!data && !isNaN(Number(urlSlug))) {
          const res = await supabase!
            .from('guests')
            .select('*')
            .eq('id', Number(urlSlug))
            .maybeSingle();
          data = res.data;
          error = res.error;
        }

        if (error) {
          console.warn('Supabase fetch guest warning:', error.message);
        }

        if (isMounted) {
          if (data) {
            setGuest({
              id: data.id,
              slug: data.slug || urlSlug,
              name: data.name || directName || config.senderName,
              greeting: data.greeting || directGreeting || `Gửi bạn ${data.name || ''},`,
              custom_message: data.custom_message || config.invitationText[0],
              start_time: data.start_time || directStart,
              end_time: data.end_time || directEnd,
              has_opened: data.has_opened || false,
              rsvp_status: data.rsvp_status || 'pending',
              rsvp_note: data.rsvp_note,
              url: data.url,
            });
          } else {
            // Not found in Supabase: use name and time from URL parameters directly
            setGuest({
              slug: urlSlug,
              name: fallbackName,
              greeting: fallbackGreeting,
              custom_message: config.invitationText[0],
              start_time: directStart,
              end_time: directEnd,
              has_opened: false,
              rsvp_status: 'pending',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching guest data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchGuest();

    return () => {
      isMounted = false;
    };
  }, []);

  // Mark envelope as opened in Supabase
  const markOpened = useCallback(async () => {
    if (!slug || !isSupabaseConfigured || !supabase || !guest.id) return;

    try {
      await supabase
        .from('guests')
        .update({
          has_opened: true,
          opened_at: new Date().toISOString(),
        })
        .eq('id', guest.id);
    } catch (err) {
      console.warn('Could not update opened status:', err);
    }
  }, [slug, guest.id]);

  // Submit RSVP response
  const submitRSVP = useCallback(
    async (status: 'attending' | 'declined', note?: string) => {
      setGuest((prev) => ({
        ...prev,
        rsvp_status: status,
        rsvp_note: note || prev.rsvp_note,
      }));

      if (!isSupabaseConfigured || !supabase || !guest.id) return;

      try {
        await supabase
          .from('guests')
          .update({
            rsvp_status: status,
            rsvp_note: note || '',
          })
          .eq('id', guest.id);
      } catch (err) {
        console.error('Error submitting RSVP:', err);
      }
    },
    [guest.id]
  );

  return {
    slug,
    guest,
    loading,
    markOpened,
    submitRSVP,
    isSupabaseConfigured,
  };
}
