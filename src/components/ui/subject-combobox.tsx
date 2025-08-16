import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { searchSubjects } from "@/data/subjects"

interface SubjectComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function SubjectCombobox({
  value,
  onValueChange,
  placeholder = "교과목을 선택하세요",
  className,
  disabled,
  onClick
}: SubjectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value || "")
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [debounceTimer, setDebounceTimer] = React.useState<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    setInputValue(value || "")
  }, [value])

  // 컴포넌트 언마운트 시 타이머 정리
  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  const [isComposing, setIsComposing] = React.useState(false)

  const performSearch = (searchValue: string) => {
    const results = searchSubjects(searchValue)
    setSuggestions(results)
    
    // 결과가 있으면 자동으로 팝오버 열기
    if (results.length > 0 && searchValue.length > 0) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    onValueChange?.(newValue)
    
    // 기존 타이머 클리어
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    // 빈 값이면 즉시 팝오버 닫기
    if (newValue.length === 0) {
      setSuggestions([])
      setOpen(false)
      return
    }
    
    // 한글 조합 중이 아닐 때만 디바운스 타이머 설정
    if (!isComposing) {
      const timer = setTimeout(() => {
        performSearch(newValue)
      }, 700) // 0.7초 딜레이
      
      setDebounceTimer(timer)
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false)
    // 조합 완료 후 디바운스 타이머로 검색 실행
    const newValue = (e.target as HTMLInputElement).value
    
    if (newValue.length > 0) {
      const timer = setTimeout(() => {
        performSearch(newValue)
      }, 700) // 0.7초 딜레이
      
      setDebounceTimer(timer)
    }
  }

  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue)
    onValueChange?.(selectedValue)
    setOpen(false)
    setSuggestions([])
  }

  const handleInputFocus = () => {
    onClick?.()
    // 포커스 시에는 자동완성을 바로 표시하지 않음
    // 사용자가 타이핑을 시작하면 디바운스 후 표시
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
          />
          {suggestions.length > 0 && (
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandList>
            {suggestions.length === 0 ? (
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
            ) : (
              <CommandGroup>
                {suggestions.map((subject) => (
                  <CommandItem
                    key={subject}
                    value={subject}
                    onSelect={() => handleSelect(subject)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === subject ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {subject}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}