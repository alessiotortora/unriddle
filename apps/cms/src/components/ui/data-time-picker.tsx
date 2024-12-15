'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [isTimeEnabled, setIsTimeEnabled] = useState(false);
  const [time, setTime] = useState(format(date, 'HH:mm') || '12:00');

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
      <PopoverContent 
        className="flex w-full flex-col p-0 sm:w-auto" 
        align="start"
        side="bottom"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          initialFocus
          className="w-full"
        />
        <div className="border-t p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="enable-time" className="text-sm font-medium">
              Enable time
            </Label>
            <Switch
              id="enable-time"
              checked={isTimeEnabled}
              onCheckedChange={setIsTimeEnabled}
            />
          </div>
          {isTimeEnabled && (
            <div className="flex flex-col">
              <Label className="mb-2 text-sm font-medium">Select Time</Label>
              <Select
                defaultValue={time}
                onValueChange={(value) => {
                  setTime(value);
                  const [hours, minutes] = value.split(':');
                  const newDate = new Date(date);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  setDate(newDate);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="h-[200px]">
                  <ScrollArea className="h-[200px]">
                    {Array.from({ length: 96 }).map((_, i) => {
                      const hour = Math.floor(i / 4)
                        .toString()
                        .padStart(2, '0');
                      const minute = ((i % 4) * 15).toString().padStart(2, '0');
                      return (
                        <SelectItem 
                          key={i} 
                          value={`${hour}:${minute}`}
                          className="py-2"
                        >
                          {hour}:{minute}
                        </SelectItem>
                      );
                    })}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
