import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Guest } from '../lib/supabase';
import config from '../invitation.config';

function getSlugFromUrl(): string {
  if (typeof window === 'undefined') return '';

  // 1. Check query parameters: ?to=tuan-anh, ?id=1, ?guest=1
  const searchParams = new URLSearchParams(window.location.search);
  const paramSlug = searchParams.get('to') || searchParams.get('id') || searchParams.get('guest');
  if (paramSlug) return decodeURIComponent(paramSlug).trim();

  // 2. Check path: /tuan-anh, /1, /guest/1
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!pathname) return '';

  const segments = pathname.split('/');
  const lastSegment = segments[segments.length - 1];

  // Avoid assets or files with extensions
  if (lastSegment && !lastSegment.includes('.')) {
    return decodeURIComponent(lastSegment).trim();
  }

  return '';
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
    const urlSlug = getSlugFromUrl();
    setSlug(urlSlug);

    if (!urlSlug) {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      // If Supabase not yet configured, provide dynamic local guest from URL
      // E.g. /nguyen-van-a => display formatted name
      const formattedName = urlSlug
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      setGuest({
        slug: urlSlug,
        name: formattedName,
        greeting: `Gửi bạn ${formattedName},`,
        custom_message: config.invitationText[0],
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

        if (isMounted && data) {
          setGuest({
            id: data.id,
            slug: data.slug || urlSlug,
            name: data.name || config.senderName,
            greeting: data.greeting || `Gửi bạn ${data.name || ''},`,
            custom_message: data.custom_message || config.invitationText[0],
            has_opened: data.has_opened || false,
            rsvp_status: data.rsvp_status || 'pending',
            rsvp_note: data.rsvp_note,
          });
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
