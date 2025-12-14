import { useState } from "react";
import { 
  Stack, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography,
  FormControl,
  Select,
  Chip,
  Box,
  useMediaQuery,
  useTheme
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FilterListIcon from "@mui/icons-material/FilterList";
import type { TaskControlsProps } from "@components/task-table/TaskTable.types";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Creation Date" },
  { value: "updatedAt", label: "Update Date" },
  { value: "title", label: "Title" },
  { value: "priority", label: "Priority" },
  { value: "deadline", label: "Deadline" },
];

export function TaskControls({
  currentSort,
  currentFilters,
  onSortChange,
  onFilterChange,
}: TaskControlsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const sortMenuOpen = Boolean(sortAnchorEl);

  const hasActiveFilters = currentFilters.status !== 'all' || currentFilters.priority !== 'all';

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => setSortAnchorEl(null);

  const handleSortSelect = (field: string) => {
    if (field === currentSort.field) {
      onSortChange?.(field, currentSort.direction === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange?.(field, 'desc');
    }
    handleSortClose();
  };

  const handleSortDirectionToggle = () => {
    onSortChange?.(currentSort.field, currentSort.direction === 'asc' ? 'desc' : 'asc');
  };

  const handleStatusChange = (event: any) => {
    onFilterChange?.('status', event.target.value);
  };

  const handlePriorityChange = (event: any) => {
    onFilterChange?.('priority', event.target.value);
  };

  const handleClearFilters = () => {
    onFilterChange?.('status', 'all');
    onFilterChange?.('priority', 'all');
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 1.5 : 2,
          alignItems: isMobile ? 'stretch' : 'center',
          mb: 2,
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Sort by:
          </Typography>
          
          <Button
            startIcon={<SortIcon />}
            onClick={handleSortClick}
            endIcon={
              currentSort.direction === 'asc' ? 
                <ArrowUpwardIcon fontSize="small" /> : 
                <ArrowDownwardIcon fontSize="small" />
            }
            size="small"
            sx={{ 
              textTransform: 'none',
              minWidth: isMobile ? 'auto' : undefined,
              px: isMobile ? 0.5 : 1,
            }}
          >
            {SORT_OPTIONS.find(opt => opt.value === currentSort.field)?.label}
          </Button>

          <Menu
            anchorEl={sortAnchorEl}
            open={sortMenuOpen}
            onClose={handleSortClose}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem 
                key={option.value} 
                onClick={() => handleSortSelect(option.value)}
                selected={currentSort.field === option.value}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>

          <IconButton
            size="small"
            onClick={handleSortDirectionToggle}
            title={`Sort ${currentSort.direction === 'asc' ? 'descending' : 'ascending'}`}
            sx={{ p: 0.5 }}
          >
            {currentSort.direction === 'asc' ? 
              <ArrowUpwardIcon fontSize="small" /> : 
              <ArrowDownwardIcon fontSize="small" />
            }
          </IconButton>
        </Stack>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 1 : 1}
          alignItems={isMobile ? "stretch" : "center"}
          sx={{ width: '100%' }}
        >
          <FilterListIcon fontSize="small" sx={{ color: 'action.active', mt: isMobile ? 0.5 : 0 }} />

          <FormControl size="small" fullWidth>
            <Select
              value={currentFilters.status}
              onChange={handleStatusChange}
              size="small"
              fullWidth
              sx={{
                '& .MuiSelect-select': {
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  padding: isMobile ? '6px 8px' : '8px 12px',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: isMobile ? '1rem' : '1.2rem',
                },
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <Select
              value={currentFilters.priority}
              onChange={handlePriorityChange}
              size="small"
              fullWidth
              sx={{
                '& .MuiSelect-select': {
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  padding: isMobile ? '6px 8px' : '8px 12px',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: isMobile ? '1rem' : '1.2rem',
                },
              }}
            >
              <MenuItem value="all">All Priority</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Button
              size="small"
              onClick={handleClearFilters}
              sx={{ 
                textTransform: 'none',
                height: 32,
                ...isMobile && {
                  minWidth: 'auto',
                  px: 0.5,
                  py: 0.5,
                }
              }}
              fullWidth={isMobile}
            >
              {isMobile ? "×" : "Clear"}
            </Button>
          )}
        </Stack>
      </Box>

      {hasActiveFilters && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {currentFilters.status !== 'all' && (
            <Chip 
              label={`Status: ${currentFilters.status}`}
              size="small"
              onDelete={() => onFilterChange?.('status', 'all')}
              sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
            />
          )}
          {currentFilters.priority !== 'all' && (
            <Chip 
              label={`Priority: ${currentFilters.priority}`}
              size="small"
              onDelete={() => onFilterChange?.('priority', 'all')}
              sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
            />
          )}
        </Stack>
      )}
    </>
  );
}