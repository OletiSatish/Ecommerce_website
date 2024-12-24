import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  addProductAsync,
  resetProductAddStatus,
  selectProductAddStatus,
} from '../../products/ProductSlice';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { selectBrands } from '../../brands/BrandSlice';
import { selectCategories } from '../../categories/CategoriesSlice';
import { toast } from 'react-toastify';

export const AddProduct = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const productAddStatus = useSelector(selectProductAddStatus);
  const navigate = useNavigate();
  const theme = useTheme();
  const is1100 = useMediaQuery(theme.breakpoints.down(1100));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (productAddStatus === 'fullfilled') {
      reset();
      toast.success('New product added');
      navigate('/admin/dashboard');
    } else if (productAddStatus === 'rejected') {
      toast.error('Error adding product, please try again later');
    }
  }, [productAddStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetProductAddStatus());
    };
  }, [dispatch]);

  const handleAddProduct = (data) => {
    const newProduct = {
      ...data,
      images: [data.image0, data.image1, data.image2, data.image3],
    };
    delete newProduct.image0;
    delete newProduct.image1;
    delete newProduct.image2;
    delete newProduct.image3;

    dispatch(addProductAsync(newProduct));
  };

  return (
    <Stack
      p={'0 16px'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'row'}
      className="bg-gray-100 min-h-screen"
    >
      <Stack
        width={is1100 ? '100%' : '60rem'}
        rowGap={6}
        mt={is480 ? 4 : 6}
        mb={6}
        p={4}
        borderRadius={2}
        component={'form'}
        noValidate
        onSubmit={handleSubmit(handleAddProduct)}
        sx={{
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Heading */}
        <Typography variant="h4" textAlign="center" fontWeight={600}>
          Add New Product
        </Typography>

        {/* Field Area */}
        <Stack rowGap={4}>
          {/* Title */}
          <Stack>
            <Typography variant="h6" fontWeight={400} gutterBottom>
              Title
            </Typography>
            <TextField
              {...register('title', { required: 'Title is required' })}
              fullWidth
              placeholder="Enter product title"
            />
          </Stack>

          {/* Brand and Category */}
          <Stack flexDirection={is480 ? 'column' : 'row'} columnGap={4} rowGap={2}>
            <FormControl fullWidth>
              <InputLabel id="brand-selection">Brand</InputLabel>
              <Select
                {...register('brand', { required: 'Brand is required' })}
                labelId="brand-selection"
                label="Brand"
              >
                {brands.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="category-selection">Category</InputLabel>
              <Select
                {...register('category', { required: 'Category is required' })}
                labelId="category-selection"
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Description */}
          <Stack>
            <Typography variant="h6" fontWeight={400} gutterBottom>
              Description
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter product description"
            />
          </Stack>

          {/* Price and Discount */}
          <Stack flexDirection={is480 ? 'column' : 'row'} columnGap={4} rowGap={2}>
            <Stack flex={1}>
              <Typography variant="h6" fontWeight={400} gutterBottom>
                Price
              </Typography>
              <TextField
                type="number"
                fullWidth
                {...register('price', { required: 'Price is required' })}
                placeholder="Enter product price"
              />
            </Stack>
            <Stack flex={1}>
              <Typography variant="h6" fontWeight={400} gutterBottom>
                Discount {is480 ? '%' : 'Percentage'}
              </Typography>
              <TextField
                type="number"
                fullWidth
                {...register('discountPercentage', {
                  required: 'Discount percentage is required',
                })}
                placeholder="Enter discount percentage"
              />
            </Stack>
          </Stack>

          {/* Stock Quantity */}
          <Stack>
            <Typography variant="h6" fontWeight={400} gutterBottom>
              Stock Quantity
            </Typography>
            <TextField
              type="number"
              fullWidth
              {...register('stockQuantity', { required: 'Stock Quantity is required' })}
              placeholder="Enter stock quantity"
            />
          </Stack>

          {/* Thumbnail */}
          <Stack>
            <Typography variant="h6" fontWeight={400} gutterBottom>
              Thumbnail
            </Typography>
            <TextField
              fullWidth
              {...register('thumbnail', { required: 'Thumbnail is required' })}
              placeholder="Enter thumbnail URL"
            />
          </Stack>

          {/* Product Images */}
          <Stack>
            <Typography variant="h6" fontWeight={400} gutterBottom>
              Product Images
            </Typography>
            <Stack rowGap={2}>
              {[0, 1, 2, 3].map((index) => (
                <TextField
                  key={index}
                  fullWidth
                  {...register(`image${index}`, { required: 'Image is required' })}
                  placeholder={`Enter image URL ${index + 1}`}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>

        {/* Action Area */}
        <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={is480 ? 2 : 4}>
          <Button size={is480 ? 'medium' : 'large'} variant="contained" type="submit">
            Add Product
          </Button>
          <Button
            size={is480 ? 'medium' : 'large'}
            variant="outlined"
            color="error"
            component={Link}
            to={'/admin/dashboard'}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
