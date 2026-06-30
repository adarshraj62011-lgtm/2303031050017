import { Box, Pagination, Typography } from "@mui/material";

export function PaginationControls({ pagination, onPageChange }) {
  if (!pagination) {
    return null;
  }

  return (
    <Box className="pagination-row">
      <Typography variant="body2" color="text.secondary">
        {pagination.total} notifications
      </Typography>
      <Pagination
        page={pagination.page}
        count={pagination.totalPages}
        color="primary"
        shape="rounded"
        onChange={(_, page) => onPageChange(page)}
      />
    </Box>
  );
}
