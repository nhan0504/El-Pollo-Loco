import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PageBar() {
  const [page, setPage] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    alert("page changed!");
  };

  return (
    <Stack spacing={2}>
      <Pagination count={10} page={page} onChange={handleChange} />
        <div></div>
    </Stack>
  );
}
