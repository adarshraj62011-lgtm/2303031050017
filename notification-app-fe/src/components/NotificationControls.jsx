import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { NotificationFilter } from "./NotificationFilter";

export function NotificationControls({
  notificationType,
  limit,
  onTypeChange,
  onLimitChange,
  title
}) {
  return (
    <Stack spacing={2} className="filters">
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Box>
          <FilterListIcon fontSize="small" />
          <NotificationFilter value={notificationType} onChange={onTypeChange} />
        </Box>

        <TextField
          select
          size="small"
          label="Limit"
          value={limit}
          onChange={(event) => onLimitChange(Number(event.target.value))}
          className="limit-control"
        >
          {[5, 10, 15, 20].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}
