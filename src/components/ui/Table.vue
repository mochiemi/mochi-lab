<!-- src/components/ui/Table.vue -->
<template>
  <div class="table-responsive">
    <table class="base-table" :class="tableClasses">
      <caption v-if="caption" class="table-caption">{{ caption }}</caption>
      
      <thead>
        <tr>
          <th 
            v-for="(column, index) in columns" 
            :key="column.key || index"
            :class="[
              `th-${column.align || 'left'}`,
              { 'th-sortable': column.sortable }
            ]"
            :style="getColumnStyle(column)"
            @click="column.sortable && handleSort(column)"
          >
            <div class="th-content">
              <span>{{ column.label }}</span>
              <OhVueIcon 
                v-if="column.sortable && sortColumn === column.key"
                :name="sortDirection === 'asc' ? 'oi-sort-ascending' : 'oi-sort-descending'"
                class="sort-icon"
              />
            </div>
          </th>
        </tr>
      </thead>
      
      <tbody>
        <tr v-if="loading" class="table-loading-row">
          <td :colspan="columns.length">
            <Loading :text="loadingText || 'Carregando...'" />
          </td>
        </tr>
        
        <tr v-else-if="data.length === 0" class="table-empty-row">
          <td :colspan="columns.length">
            <div class="empty-state">
              <OhVueIcon :name="emptyIcon || 'oi-inbox'" class="empty-icon" />
              <span>{{ emptyText || 'Nenhum dado encontrado' }}</span>
            </div>
          </td>
        </tr>
        
        <tr 
          v-else
          v-for="(row, rowIndex) in paginatedData" 
          :key="row.id || rowIndex"
          :class="{ 'row-clickable': clickable }"
          @click="clickable && $emit('row-click', { row, index: rowIndex })"
        >
          <td 
            v-for="(column, colIndex) in columns" 
            :key="column.key || colIndex"
            :class="`td-${column.align || 'left'}`"
          >
            <slot 
              :name="`cell-${column.key}`" 
              :row="row" 
              :column="column"
              :value="getCellValue(row, column)"
            >
              {{ getCellValue(row, column) }}
            </slot>
          </td>
        </tr>
      </tbody>
      
      <tfoot v-if="$slots.footer">
        <tr>
          <td :colspan="columns.length">
            <slot name="footer" />
          </td>
        </tr>
      </tfoot>
    </table>
    
    <div v-if="paginated && data.length > pageSize" class="table-pagination">
      <Button 
        variant="secondary" 
        size="small"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <OhVueIcon name="oi-chevron-left" />
      </Button>
      
      <span class="pagination-info">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      
      <Button 
        variant="secondary" 
        size="small"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <OhVueIcon name="oi-chevron-right" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import Loading from './Loading.vue'
import Button from './Button.vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (cols) => cols.every(col => col.key && col.label)
  },
  data: {
    type: Array,
    default: () => []
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'minimal'].includes(value)
  },
  striped: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  bordered: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  },
  caption: {
    type: String,
    default: ''
  },
  emptyText: {
    type: String,
    default: ''
  },
  emptyIcon: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: false
  },
  paginated: {
    type: Boolean,
    default: false
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['row-click', 'sort-change', 'page-change'])

const sortColumn = ref('')
const sortDirection = ref('asc')
const currentPage = ref(1)

const tableClasses = computed(() => ({
  [`table-${props.variant}`]: true,
  'table-striped': props.striped,
  'table-hoverable': props.hoverable,
  'table-bordered': props.bordered,
  'table-compact': props.compact
}))

const sortedData = computed(() => {
  if (!sortColumn.value) return props.data
  
  const column = props.columns.find(col => col.key === sortColumn.value)
  if (!column) return props.data
  
  return [...props.data].sort((a, b) => {
    let aVal = getNestedValue(a, sortColumn.value)
    let bVal = getNestedValue(b, sortColumn.value)
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedData = computed(() => {
  if (!props.paginated) return sortedData.value
  
  const start = (currentPage.value - 1) * props.pageSize
  return sortedData.value.slice(start, start + props.pageSize)
})

const totalPages = computed(() => 
  Math.ceil(props.data.length / props.pageSize)
)

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : undefined, obj
  )
}

const getCellValue = (row, column) => {
  if (column.formatter) return column.formatter(row[column.key], row)
  if (column.value) return column.value(row)
  return row[column.key]
}

const getColumnStyle = (column) => {
  const styles = {}
  if (column.width) styles.width = column.width
  if (column.minWidth) styles.minWidth = column.minWidth
  if (column.maxWidth) styles.maxWidth = column.maxWidth
  return styles
}

const handleSort = (column) => {
  if (sortColumn.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column.key
    sortDirection.value = 'asc'
  }
  
  emit('sort-change', {
    column: sortColumn.value,
    direction: sortDirection.value
  })
}

watch(currentPage, (newPage) => {
  emit('page-change', newPage)
})

watch(() => props.data, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 1rem 0;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Comfortaa', sans-serif;
  font-size: 0.9rem;
  background: var(--surface-primary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow);
}

.table-default {
  --table-header-bg: var(--sky-blue-surface);
  --table-header-color: var(--title-secondary);
  --table-border-color: var(--border);
}

.table-primary {
  --table-header-bg: var(--primary);
  --table-header-color: white;
  --table-border-color: var(--primary);
}

.table-secondary {
  --table-header-bg: var(--secondary);
  --table-header-color: white;
  --table-border-color: var(--secondary);
}

.table-minimal {
  --table-header-bg: transparent;
  --table-border-color: transparent;
  box-shadow: none;
}

thead tr {
  background: var(--table-header-bg, var(--sky-blue-surface));
  border-bottom: 2px solid var(--border-secondary);
}

th {
  padding: 1rem 0.75rem;
  font-family: 'Shantell Sans', cursive;
  font-weight: 600;
  color: var(--table-header-color, var(--title-secondary));
  text-align: left;
  white-space: nowrap;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.th-sortable {
  cursor: pointer;
  user-select: none;
}

.th-sortable:hover {
  background: color-mix(in srgb, var(--table-header-bg) 80%, black);
}

.sort-icon {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--table-border-color, var(--border));
  color: var(--text-primary);
  vertical-align: middle;
}

.table-striped tbody tr:nth-child(even) {
  background: var(--surface-secondary);
}

.table-hoverable tbody tr:hover {
  background: var(--inner-surface);
}

.table-bordered th,
.table-bordered td {
  border: 1px solid var(--table-border-color, var(--border));
}

.table-bordered th {
  border-bottom-width: 2px;
}

.table-compact th,
.table-compact td {
  padding: 0.5rem 0.5rem;
}

.th-left,
.td-left {
  text-align: left;
}

.th-center,
.td-center {
  text-align: center;
}

.th-right,
.td-right {
  text-align: right;
}

.table-caption {
  padding: 0.75rem;
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 1.1rem;
  color: var(--title-primary);
  background: var(--rose-surface);
  border-radius: 8px 8px 0 0;
  font-weight: 600;
}

.table-loading-row td {
  padding: 3rem;
}

.table-empty-row td {
  padding: 3rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  color: var(--border);
}

.table-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-secondary);
  border-top: 1px solid var(--border);
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-family: 'Comfortaa', sans-serif;
}

.row-clickable {
  cursor: pointer;
}

.row-clickable:hover {
  background: var(--inner-surface) !important;
}

@media (max-width: 768px) {
  th, td {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .table-pagination {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>