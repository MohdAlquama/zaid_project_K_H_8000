import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const paginationLinkVariants = cva("", {
  variants: {
    isActive: {
      true: "border border-input bg-accent text-accent-foreground shadow-sm hover:bg-accent",
      false: "hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      default: "h-9 min-w-9 px-4",
      sm: "h-8 min-w-8 px-3 text-xs",
      icon: "h-9 w-9",
    },
  },
  defaultVariants: {
    isActive: false,
    size: "icon",
  },
})

function Pagination({ className, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem(props) {
  return <li {...props} />
}

const PaginationLink = React.forwardRef(
  ({ className, isActive, size = "icon", ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: "ghost", size }),
        paginationLinkVariants({ isActive, size }),
        className,
      )}
      {...props}
    />
  ),
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = React.forwardRef(({ className, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 px-3 sm:pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
))
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = React.forwardRef(({ className, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 px-3 sm:pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
))
PaginationNext.displayName = "PaginationNext"

function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
