'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [isTimeEnabled, setIsTimeEnabled] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, isTimeEnabled ? 'PPP HH:mm' : 'PPP')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          initialFocus
        />
        <div className="space-y-2 border-t p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-time" className="text-sm font-medium">
              Enable time selection
            </Label>
            <Switch
              id="enable-time"
              checked={isTimeEnabled}
              onCheckedChange={setIsTimeEnabled}
            />
          </div>
          {isTimeEnabled && (
            <div className="mt-2 flex items-center">
              <ClockIcon className="text-muted-foreground mr-2 h-4 w-4" />
              <Input
                type="time"
                value={format(date, 'HH:mm')}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(date);
                  newDate.setHours(parseInt(hours));
                  newDate.setMinutes(parseInt(minutes));
                  setDate(newDate);
                }}
                className="w-full"
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
