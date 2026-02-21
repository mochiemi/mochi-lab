<template>
  <div class="table-container" :class="{ 'table-responsive': responsive }">
    <table
      class="base-table"
      :class="[
        `table-${variant}`,
        `table-size-${size}`,
        {
          'table-bordered': bordered,
          'table-striped': striped,
          'table-hoverable': hoverable,
          'table-compact': compact,
          'table-with-shadow': withShadow,
          'table-loading': loading
        }
      ]"
    >
      <!-- Caption -->
      <caption v-if="caption" class="table-caption">
        {{ caption }}
      </caption>

      <!-- Header -->
      <thead v-if="columns.length > 0">
        <tr>
          <th
            v-for="(column, index) in columns"
            :key="column.key || index"
            :class="[
              `th-${column.align || 'left'}`,
              {
                'th-sortable': column.sortable,
                'th-sorted': sortColumn === column.key,
                'th-sorted-asc': sortColumn === column.key && sortDirection === 'asc',
                'th-sorted-desc': sortColumn === column.key && sortDirection === 'desc',
                'th-fixed': column.fixed,
                [`th-width-${column.width}`]: column.width
              }
            ]"
            :style="getColumnStyle(column)"
            @click="handleSort(column)"
          >
            <div class="th-content">
              <span class="th-label">{{ column.label }}</span>
              <span v-if="column.sortable" class="sort-icon">
                <OhVueIcon
                  :name="getSortIcon(column)"
                  class="sort-icon-svg"
                />
              </span>
            </div>
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <!-- Loading State -->
        <tr v-if="loading" class="table-loading-row">
          <td :colspan="columns.length">
            <div class="loading-state">
              <Loading :text="loadingText || t('components.table.loading')" />
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="data.length === 0" class="table-empty-row">
          <td :colspan="columns.length">
            <div class="empty-state">
              <OhVueIcon :name="emptyIcon || 'oi-inbox'" class="empty-icon" />
              <span class="empty-text">{{ emptyText || t('components.table.empty') }}</span>
            </div>
          </td>
        </tr>

        <!-- Data Rows -->
        <template v-else>
          <tr
            v-for="(row, rowIndex) in paginatedData"
            :key="row.id || rowIndex"
            :class="[
              {
                'row-clickable': clickable,
                'row-selected': isRowSelected(row, rowIndex),
                'row-disabled': row.disabled,
                [`row-${row.variant}`]: row.variant
              }
            ]"
            @click="handleRowClick(row, rowIndex)"
            @dblclick="handleRowDblClick(row, rowIndex)"
          >
            <td
              v-for="(column, colIndex) in columns"
              :key="column.key || colIndex"
              :class="[
                `td-${column.align || 'left'}`,
                {
                  'td-nowrap': column.nowrap,
                  'td-truncate': column.truncate,
                  [`td-${column.variant}`]: column.variant
                }
              ]"
            >
              <!-- Custom Cell Template -->
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="getCellValue(row, column)"
                :index="rowIndex"
              >
                <!-- Default Cell Content -->
                <template v-if="column.type === 'badge'">
                  <Badge
                    :variant="getBadgeVariant(row, column)"
                    :size="compact ? 'small' : 'medium'"
                  >
                    {{ getCellValue(row, column) }}
                  </Badge>
                </template>

                <template v-else-if="column.type === 'progress'">
                  <Progress
                    :value="getCellValue(row, column)"
                    :variant="getProgressVariant(row, column)"
                    :size="compact ? 'small' : 'medium'"
                    :show-label="column.showLabel"
                  />
                </template>

                <template v-else-if="column.type === 'boolean'">
                  <OhVueIcon
                    :name="getCellValue(row, column) ? 'oi-check-circle' : 'oi-x-circle'"
                    :class="['boolean-icon', getCellValue(row, column) ? 'boolean-true' : 'boolean-false']"
                  />
                </template>

                <template v-else-if="column.type === 'date'">
                  {{ formatDate(getCellValue(row, column), column.dateFormat) }}
                </template>

                <template v-else-if="column.type === 'currency'">
                  {{ formatCurrency(getCellValue(row, column), column.currency) }}
                </template>

                <template v-else-if="column.type === 'actions'">
                  <div class="cell-actions">
                    <Button
                      v-for="action in getCellValue(row, column)"
                      :key="action.id"
                      :variant="action.variant || 'secondary'"
                      :size="compact ? 'small' : 'medium'"
                      @click.stop="handleAction(action, row, rowIndex)"
                    >
                      <OhVueIcon v-if="action.icon" :name="action.icon" />
                      {{ action.label }}
                    </Button>
                  </div>
                </template>

                <template v-else>
                  <span
                    :class="{ 'truncated-text': column.truncate }"
                    :title="column.truncate ? getCellValue(row, column) : ''"
                  >
                    {{ getCellValue(row, column) }}
                  </span>
                </template>
              </slot>
            </td>
          </tr>
        </template>
      </tbody>

      <!-- Footer -->
      <tfoot v-if="showFooter || $slots.footer">
        <tr>
          <td
            v-for="(column, index) in columns"
            :key="column.key || index"
            :class="`td-${column.align || 'left'}`"
          >
            <slot name="footer" :column="column">
              {{ column.footer }}
            </slot>
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- Pagination -->
    <div v-if="paginated && data.length > pageSize" class="table-pagination">
      <div class="pagination-info">
        {{ t('components.table.showing') }}
        {{ (currentPage - 1) * pageSize + 1 }} -
        {{ Math.min(currentPage * pageSize, data.length) }}
        {{ t('components.table.of') }} {{ data.length }}
      </div>
      <div class="pagination-controls">
        <Button
          variant="secondary"
          size="small"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <OhVueIcon name="oi-chevron-left" />
        </Button>
        <span class="pagination-pages">
          <Button
            v-for="page in visiblePages"
            :key="page"
            :variant="currentPage === page ? 'primary' : 'secondary'"
            size="small"
            @click="currentPage = page"
          >
            {{ page }}
          </Button>
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
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { OhVueIcon } from 'oh-vue-icons'
import Button from './Button.vue'
import Badge from './Badge.vue'
import Progress from './Progress.vue'
import Loading from './Loading.vue'

const { t } = useI18n()

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    validator: (columns) => {
      return columns.every(col => col.key && col.label)
    }
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
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  bordered: {
    type: Boolean,
    default: false
  },
  striped: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: true
  },
  compact: {
    type: Boolean,
    default: false
  },
  withShadow: {
    type: Boolean,
    default: false
  },
  responsive: {
    type: Boolean,
    default: true
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
  selectable: {
    type: Boolean,
    default: false
  },
  selectionType: {
    type: String,
    default: 'single',
    validator: (value) => ['single', 'multiple'].includes(value)
  },
  sortable: {
    type: Boolean,
    default: false
  },
  defaultSortColumn: {
    type: String,
    default: ''
  },
  defaultSortDirection: {
    type: String,
    default: 'asc',
    validator: (value) => ['asc', 'desc'].includes(value)
  },
  paginated: {
    type: Boolean,
    default: false
  },
  pageSize: {
    type: Number,
    default: 10
  },
  showFooter: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'row-click',
  'row-dblclick',
  'sort-change',
  'page-change',
  'selection-change',
  'action-click'
])

// State
const sortColumn = ref(props.defaultSortColumn)
const sortDirection = ref(props.defaultSortDirection)
const currentPage = ref(1)
const selectedRows = ref(new Set())

// Computed
const sortedData = computed(() => {
  if (!props.sortable || !sortColumn.value) return props.data

  const column = props.columns.find(col => col.key === sortColumn.value)
  if (!column || !column.sortable) return props.data

  return [...props.data].sort((a, b) => {
    let aVal = getNestedValue(a, sortColumn.value)
    let bVal = getNestedValue(b, sortColumn.value)

    // Handle different types
    if (column.sortType === 'number') {
      aVal = Number(aVal) || 0
      bVal = Number(bVal) || 0
    } else if (column.sortType === 'date') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    } else {
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
    }

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedData = computed(() => {
  if (!props.paginated) return sortedData.value

  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return sortedData.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(props.data.length / props.pageSize)
)

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

// Methods
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : undefined, obj
  )
}

const getCellValue = (row, column) => {
  if (column.value) {
    return column.value(row)
  }
  return getNestedValue(row, column.key)
}

const getColumnStyle = (column) => {
  const styles = {}
  if (column.width) {
    styles.width = column.width
    styles.minWidth = column.width
  }
  if (column.fixed) {
    styles.position = 'sticky'
    styles.left = column.fixed
    styles.zIndex = 2
  }
  return styles
}

const getSortIcon = (column) => {
  if (sortColumn.value !== column.key) return 'oi-sort'
  return sortDirection.value === 'asc' ? 'oi-sort-ascending' : 'oi-sort-descending'
}

const handleSort = (column) => {
  if (!column.sortable) return

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

const handleRowClick = (row, index) => {
  if (row.disabled) return

  if (props.selectable) {
    const rowId = row.id || index
    if (props.selectionType === 'single') {
      selectedRows.value.clear()
      selectedRows.value.add(rowId)
    } else {
      if (selectedRows.value.has(rowId)) {
        selectedRows.value.delete(rowId)
      } else {
        selectedRows.value.add(rowId)
      }
    }
    emit('selection-change', Array.from(selectedRows.value))
  }

  if (props.clickable) {
    emit('row-click', { row, index })
  }
}

const handleRowDblClick = (row, index) => {
  if (!row.disabled) {
    emit('row-dblclick', { row, index })
  }
}

const handleAction = (action, row, index) => {
  if (!action.disabled) {
    emit('action-click', { action, row, index })
  }
}

const isRowSelected = (row, index) => {
  return selectedRows.value.has(row.id || index)
}

const getBadgeVariant = (row, column) => {
  const value = getCellValue(row, column)
  if (column.badgeMap && column.badgeMap[value]) {
    return column.badgeMap[value]
  }
  return column.badgeVariant || 'primary'
}

const getProgressVariant = (row, column) => {
  const value = getCellValue(row, column)
  if (column.progressMap && column.progressMap[value]) {
    return column.progressMap[value]
  }
  return column.progressVariant || 'primary'
}

const formatDate = (value, format) => {
  if (!value) return ''
  const date = new Date(value)
  return new Intl.DateTimeFormat('default', {
    dateStyle: format || 'medium'
  }).format(date)
}

const formatCurrency = (value, currency = 'USD') => {
  if (value === undefined || value === null) return ''
  return new Intl.NumberFormat('default', {
    style: 'currency',
    currency: currency
  }).format(value)
}

// Watch for page changes
watch(currentPage, (newPage) => {
  emit('page-change', newPage)
})

// Watch for data changes
watch(() => props.data, () => {
  currentPage.value = 1
  selectedRows.value.clear()
})
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
}

.table-responsive {
  -webkit-overflow-scrolling: touch;
}

.base-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--surface-primary);
  transition: all 0.3s ease;
  font-family: inherit;
}

/* Variants */
.table-default {
  --table-header-bg: var(--surface-secondary);
  --table-row-hover: var(--inner-surface);
  --table-border-color: var(--border);
}

.table-primary {
  --table-header-bg: var(--primary);
  --table-header-color: white;
  --table-row-hover: var(--inner-surface);
  --table-border-color: var(--primary);
}

.table-secondary {
  --table-header-bg: var(--secondary);
  --table-header-color: white;
  --table-row-hover: var(--inner-surface);
  --table-border-color: var(--secondary);
}

.table-minimal {
  --table-header-bg: transparent;
  --table-border-color: transparent;
}

/* Sizes */
.table-size-small {
  font-size: 0.875rem;
}

.table-size-small th,
.table-size-small td {
  padding: 0.5rem;
}

.table-size-medium th,
.table-size-medium td {
  padding: 1rem;
}

.table-size-large th,
.table-size-large td {
  padding: 1.25rem;
}

/* Compact */
.table-compact th,
.table-compact td {
  padding: 0.375rem 0.75rem;
}

/* Header */
th {
  background: var(--table-header-bg, var(--surface-secondary));
  color: var(--table-header-color, var(--text-primary));
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid var(--table-border-color, var(--border));
  position: relative;
  white-space: nowrap;
  transition: background 0.2s ease;
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

.th-sorted {
  background: color-mix(in srgb, var(--table-header-bg) 90%, var(--primary));
}

.sort-icon {
  display: inline-flex;
  align-items: center;
  color: var(--text-secondary);
}

.sort-icon-svg {
  font-size: 1rem;
}

/* Cells */
td {
  border-bottom: 1px solid var(--table-border-color, var(--border));
  color: var(--text-primary);
  transition: background 0.2s ease;
  vertical-align: middle;
}

/* Alignment */
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

/* Bordered */
.table-bordered th,
.table-bordered td {
  border: 1px solid var(--table-border-color, var(--border));
}

.table-bordered th {
  border-bottom-width: 2px;
}

/* Striped */
.table-striped tbody tr:nth-child(even) {
  background: var(--inner-surface);
}

/* Hoverable */
.table-hoverable tbody tr:not(.row-disabled):hover {
  background: var(--table-row-hover, var(--inner-surface));
}

/* With Shadow */
.table-with-shadow {
  box-shadow: 0 4px 12px var(--shadow);
}

/* Rows */
.row-clickable {
  cursor: pointer;
}

.row-selected {
  background: var(--rose-surface) !important;
}

.row-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.row-primary {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

.row-secondary {
  background: color-mix(in srgb, var(--secondary) 10%, transparent);
}

.row-success {
  background: color-mix(in srgb, var(--green) 10%, transparent);
}

.row-warning {
  background: color-mix(in srgb, var(--orange) 10%, transparent);
}

.row-danger {
  background: color-mix(in srgb, var(--red) 10%, transparent);
}

/* Cell variations */
.td-nowrap {
  white-space: nowrap;
}

.td-truncate {
  max-width: 200px;
}

.truncated-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Boolean icons */
.boolean-icon {
  font-size: 1.25rem;
}

.boolean-true {
  color: var(--green);
}

.boolean-false {
  color: var(--red);
}

/* Cell actions */
.cell-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Loading State */
.table-loading-row td {
  padding: 3rem;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  color: var(--border);
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1rem;
}

/* Footer */
tfoot td {
  background: var(--surface-secondary);
  font-weight: 600;
  border-top: 2px solid var(--table-border-color, var(--border));
}

/* Pagination */
.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--surface-secondary);
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

/* Fixed columns */
.th-fixed,
.td-fixed {
  position: sticky;
  background: inherit;
  z-index: 2;
}

/* Responsive */
@media (max-width: 768px) {
  .table-pagination {
    flex-direction: column;
    text-align: center;
  }

  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .cell-actions {
    flex-direction: column;
  }

  .cell-actions button {
    width: 100%;
  }

  .table-size-large th,
  .table-size-large td {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .pagination-pages {
    flex-wrap: wrap;
    justify-content: center;
  }

  .empty-state {
    padding: 2rem;
  }
}
</style>