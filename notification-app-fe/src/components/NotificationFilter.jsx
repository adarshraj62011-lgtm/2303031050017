import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const filters = [
  { label: "All", value: "" },
  { label: "Placement", value: "Placement" },
  { label: "Result", value: "Result" },
  { label: "Event", value: "Event" }
];

export function NotificationFilter({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      size="small"
      sx={{ flexWrap: "wrap", gap: 0.5 }}
      onChange={(_, nextValue) => onChange(nextValue ?? "")}
    >
      {filters.map((type) => (
        <ToggleButton
          key={type.value || "all"}
          value={type.value}
          sx={{ textTransform: "none", px: 2 }}
        >
          {type.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
