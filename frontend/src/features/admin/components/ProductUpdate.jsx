import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clearSelectedProduct, fetchProductByIdAsync, resetProductUpdateStatus, selectProductUpdateStatus, selectSelectedProduct, updateProductByIdAsync } from '../../products/ProductSlice'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery, useTheme, Divider, Grid, Box } from '@mui/material'
import { useForm } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { toast } from 'react-toastify'

export const ProductUpdate = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { id } = useParams()
    const dispatch = useDispatch()
    const selectedProduct = useSelector(selectSelectedProduct)
    const brands = useSelector(selectBrands)
    const categories = useSelector(selectCategories)
    const productUpdateStatus = useSelector(selectProductUpdateStatus)
    const navigate = useNavigate()
    const theme = useTheme()
    const is1100 = useMediaQuery(theme.breakpoints.down(1100))
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
        }
    }, [id])

    useEffect(() => {
        if (productUpdateStatus === 'fullfilled') {
            toast.success("Product Updated")
            navigate("/admin/dashboard")
        } else if (productUpdateStatus === 'rejected') {
            toast.error("Error updating product, please try again later")
        }
    }, [productUpdateStatus])

    useEffect(() => {
        return () => {
            dispatch(clearSelectedProduct())
            dispatch(resetProductUpdateStatus())
        }
    }, [])

    const handleProductUpdate = (data) => {
        const productUpdate = { ...data, _id: selectedProduct._id, images: [data?.image0, data?.image1, data?.image2, data?.image3] }
        delete productUpdate?.image0
        delete productUpdate?.image1
        delete productUpdate?.image2
        delete productUpdate?.image3

        dispatch(updateProductByIdAsync(productUpdate))
    }

    return (
        <Stack p={'0 16px'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'}>
            {
                selectedProduct &&
                <Stack width={is1100 ? "100%" : "60rem"} rowGap={4} mt={is480 ? 4 : 6} mb={6} component={'form'} noValidate onSubmit={handleSubmit(handleProductUpdate)}>

                    <Typography variant="h4" fontWeight={600} mb={4} textAlign="center">Update Product</Typography>

                    {/* Fields Area */}
                    <Grid container spacing={3}>
                        {/* Title */}
                        <Grid item xs={12}>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Title</Typography>
                            <TextField fullWidth {...register("title", { required: 'Title is required', value: selectedProduct.title })} error={!!errors.title} helperText={errors.title?.message} />
                        </Grid>

                        {/* Brand & Category */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="brand-selection">Brand</InputLabel>
                                <Select defaultValue={selectedProduct.brand._id} {...register("brand", { required: "Brand is required" })} labelId="brand-selection" label="Brand">
                                    {
                                        brands.map((brand) => (
                                            <MenuItem key={brand._id} value={brand._id}>{brand.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="category-selection">Category</InputLabel>
                                <Select defaultValue={selectedProduct.category._id} {...register("category", { required: "Category is required" })} labelId="category-selection" label="Category">
                                    {
                                        categories.map((category) => (
                                            <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Description</Typography>
                            <TextField fullWidth multiline rows={4} {...register("description", { required: "Description is required", value: selectedProduct.description })} error={!!errors.description} helperText={errors.description?.message} />
                        </Grid>

                        {/* Price & Discount */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Price</Typography>
                            <TextField fullWidth type='number' {...register("price", { required: "Price is required", value: selectedProduct.price })} error={!!errors.price} helperText={errors.price?.message} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Discount {is480 ? "%" : "Percentage"}</Typography>
                            <TextField fullWidth type='number' {...register("discountPercentage", { required: "Discount Percentage is required", value: selectedProduct.discountPercentage })} error={!!errors.discountPercentage} helperText={errors.discountPercentage?.message} />
                        </Grid>

                        {/* Stock Quantity */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Stock Quantity</Typography>
                            <TextField fullWidth type='number' {...register("stockQuantity", { required: "Stock Quantity is required", value: selectedProduct.stockQuantity })} error={!!errors.stockQuantity} helperText={errors.stockQuantity?.message} />
                        </Grid>

                        {/* Thumbnail */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Thumbnail</Typography>
                            <TextField fullWidth {...register("thumbnail", { required: "Thumbnail is required", value: selectedProduct.thumbnail })} error={!!errors.thumbnail} helperText={errors.thumbnail?.message} />
                        </Grid>

                        {/* Product Images */}
                        <Grid item xs={12}>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Product Images</Typography>
                            <Stack rowGap={2}>
                                {
                                    selectedProduct.images.map((image, index) => (
                                        <TextField key={index} fullWidth {...register(`image${index}`, { required: "Image is required", value: image })} error={!!errors[`image${index}`]} helperText={errors[`image${index}`]?.message} />
                                    ))
                                }
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    {/* Action Area */}
                    <Stack flexDirection={'row'} justifyContent={'flex-end'} columnGap={2}>
                        <Button size={is480 ? 'medium' : 'large'} variant='contained' type='submit'>Update</Button>
                        <Button size={is480 ? 'medium' : 'large'} variant='outlined' color='error' component={Link} to={'/admin/dashboard'}>Cancel</Button>
                    </Stack>
                </Stack>
            }
        </Stack>
    )
}
