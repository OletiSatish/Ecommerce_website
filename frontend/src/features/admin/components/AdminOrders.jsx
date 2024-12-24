import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersAsync, resetOrderUpdateStatus, selectOrderUpdateStatus, selectOrders, updateOrderByIdAsync } from '../../order/OrderSlice';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Button, Chip,
  FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery, useTheme
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { noOrdersAnimation } from '../../../assets/index';
import Lottie from 'lottie-react';

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [editIndex, setEditIndex] = useState(-1);
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);
  const theme = useTheme();
  const is1620 = useMediaQuery(theme.breakpoints.down(1620));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(getAllOrdersAsync());
  }, [dispatch]);

  useEffect(() => {
    if (orderUpdateStatus === 'fulfilled') {
      toast.success("Status updated");
    } else if (orderUpdateStatus === 'rejected') {
      toast.error("Error updating order status");
    }
  }, [orderUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetOrderUpdateStatus());
    };
  }, []);

  const handleUpdateOrder = (data) => {
    const update = { ...data, _id: orders[editIndex]._id };
    setEditIndex(-1);
    dispatch(updateOrderByIdAsync(update));
  };

  const editOptions = ['Pending', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled'];

  const getStatusColor = (status) => {
    if (status === 'Pending') {
      return { bgcolor: '#dfc9f7', color: '#7c59a4' };
    }
    if (status === 'Dispatched') {
      return { bgcolor: '#feed80', color: '#927b1e' };
    }
    if (status === 'Out for delivery') {
      return { bgcolor: '#AACCFF', color: '#4793AA' };
    }
    if (status === 'Delivered') {
      return { bgcolor: '#b3f5ca', color: '#548c6a' };
    }
    return { bgcolor: '#fac0c0', color: '#cc6d72' };
  };

  return (
    <Stack justifyContent={'center'} alignItems={'center'} sx={{ maxWidth: '98vw', padding: '2rem' }}>
      <Typography variant="h4" fontWeight="bold">
        Manage Orders
      </Typography>

      <Stack mt={5} mb={3} component={'form'} noValidate onSubmit={handleSubmit(handleUpdateOrder)}>

        {/* Table of Orders */}
        {orders.length ? (
          <TableContainer sx={{ width: is1620 ? "95vw" : "100%", overflowX: 'auto' }} component={Paper} elevation={4}>
            <Table aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: '16px' }}><Typography variant="h6" fontWeight="bold" fontSize="1rem">S.No</Typography></TableCell>
                  <TableCell align="left" sx={{ padding: '16px' }}><Typography variant="h6" fontWeight="bold" fontSize="1rem">Order ID</Typography></TableCell>
                  <TableCell align="left" sx={{ padding: '16px' }}><Typography variant="h6" fontWeight="bold" fontSize="1rem">Products</Typography></TableCell>
                  <TableCell align="right" sx={{ padding: '16px' }}><Typography variant="h6" fontWeight="bold" fontSize="1rem">Total Amount</Typography></TableCell>
                  <TableCell align="right" sx={{ padding: '16px' }}><Typography variant="h6" fontWeight="bold" fontSize="1rem">Shipping Address</Typography></TableCell>
                  <TableCell align="right" sx={{ padding: '16px' }}><Typography variant="h6" fontWeight="bold" fontSize="1rem">Payment Method</Typography></TableCell>
                  <TableCell align="right" sx={{ padding: '16px' }}><Typography variant="h6" fontWeight="bold" fontSize="1rem">Order Date</Typography></TableCell>
                  <TableCell align="right" sx={{ padding: '16px' }}><Typography variant="h6" fontWeight="bold" fontSize="1rem">Status</Typography></TableCell>
                  <TableCell align="right" sx={{ padding: '16px' }}><Typography variant="h6" fontWeight="bold" fontSize="1rem">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={order._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" sx={{ padding: '16px' }}>{index + 1}</TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>{order._id}</TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>
                      {order.item.map((product) => (
                        <Stack mt={1} flexDirection={'row'} alignItems={'center'} columnGap={1} key={product.product._id}>
                          <Avatar src={product.product.thumbnail} />
                          <Typography variant="body2" fontWeight="medium">{product.product.title}</Typography>
                        </Stack>
                      ))}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>{order.total}</TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>
                      <Stack>
                        <Typography>{order.address[0].street}</Typography>
                        <Typography>{order.address[0].city}</Typography>
                        <Typography>{order.address[0].state}</Typography>
                        <Typography>{order.address[0].postalCode}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>{order.paymentMode}</TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>{new Date(order.createdAt).toDateString()}</TableCell>

                    <TableCell align="right" sx={{ padding: '16px' }}>
                      {editIndex === index ? (
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Update Status</InputLabel>
                          <Select
                            defaultValue={order.status}
                            label="Update Status"
                            {...register('status', { required: 'Status is required' })}
                          >
                            {editOptions.map((option) => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip label={order.status} sx={getStatusColor(order.status)} />
                      )}
                    </TableCell>

                    <TableCell align="right" sx={{ padding: '16px' }}>
                      {editIndex === index ? (
                        <Button variant="contained" color="primary" type="submit">
                          <CheckCircleOutlinedIcon />
                          Save
                        </Button>
                      ) : (
                        <IconButton onClick={() => setEditIndex(index)}>
                          <EditOutlinedIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack width={is480 ? "auto" : '30rem'} justifyContent={'center'} alignItems={'center'}>
            <Lottie animationData={noOrdersAnimation} />
            <Typography textAlign={'center'} variant="h6" fontWeight={400}>
              There are no orders currently
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
