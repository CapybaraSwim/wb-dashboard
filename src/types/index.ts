export interface Sale {
    g_number: string
    date: string
    last_change_date: string
    supplier_article: string
    tech_size: string
    barcode: string
    total_price: string
}

export interface Order {
  g_number: string
  date: string
  last_change_date: string
  supplier_article: string
  tech_size: string
  barcode: string
  total_price: string
}

export interface Stock {
  date: string 
  last_change_date: string | null
  supplier_article: string
  tech_size: string
  barcode: string
  quantity: string
  is_supply: boolean | null
  is_realization: boolean | null
  quantity_full: string
  quantity_not_in_orders: string
}

export interface Income {
  income_id: number
  number: string
  date: string
  last_change_date: string
  supplier_article: string
  tech_size: string
  barcode: string
  quantity: number
  total_price: string
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}