import { useEffect, useRef } from 'react';

import { createClient } from '@/utils/supabase/client';

export function useRealtime(channelName: string, onEvent: (payload: any) => void) {
  const supabase = createClient();
  const callbackRef = useRef(onEvent);

  useEffect(() => {
    callbackRef.current = onEvent;
  });

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'videos' }, (payload) => {
        if (callbackRef.current) {
          callbackRef.current(payload);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, supabase]);
}
