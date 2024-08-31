import React, { useState, useEffect } from 'react';
import { Container, Typography, Tabs, Tab, Box, TextField, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { Send, RequestPage, QrCode } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    const result = await backend.getBalance();
    setBalance(Number(result));
  };

  const fetchTransactions = async () => {
    const result = await backend.getTransactionHistory();
    setTransactions(result);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (value === 0) {
        await backend.sendMoney(data.recipient, Number(data.amount), data.note);
      } else if (value === 1) {
        await backend.requestMoney(data.recipient, Number(data.amount), data.note);
      }
      fetchBalance();
      fetchTransactions();
      reset();
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          FlashCash
        </Typography>
        <Typography variant="h3" component="h2" gutterBottom>
          ${balance !== null ? balance.toFixed(2) : '---'}
        </Typography>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Send" icon={<Send />} />
          <Tab label="Request" icon={<RequestPage />} />
          <Tab label="QR Code" icon={<QrCode />} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="recipient"
              control={control}
              defaultValue=""
              rules={{ required: 'Recipient is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Recipient"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="amount"
              control={control}
              defaultValue=""
              rules={{ required: 'Amount is required', min: { value: 0.01, message: 'Amount must be greater than 0' } }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Amount"
                  fullWidth
                  margin="normal"
                  type="number"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="note"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Note (optional)"
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            >
              {loading ? 'Processing...' : 'Send'}
            </Button>
          </form>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="recipient"
              control={control}
              defaultValue=""
              rules={{ required: 'Recipient is required' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Request From"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="amount"
              control={control}
              defaultValue=""
              rules={{ required: 'Amount is required', min: { value: 0.01, message: 'Amount must be greater than 0' } }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Amount"
                  fullWidth
                  margin="normal"
                  type="number"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="note"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Note (optional)"
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <RequestPage />}
            >
              {loading ? 'Processing...' : 'Request'}
            </Button>
          </form>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <QrCode sx={{ fontSize: 100 }} />
          </Box>
          <Typography variant="body1" align="center">
            Scan to pay me
          </Typography>
        </TabPanel>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Transaction History
          </Typography>
          <List>
            {transactions.map((transaction, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${transaction.transactionType === 'send' ? 'Sent to' : 'Requested from'} ${transaction.recipient}`}
                  secondary={`$${transaction.amount.toFixed(2)} - ${new Date(Number(transaction.timestamp) / 1000000).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
