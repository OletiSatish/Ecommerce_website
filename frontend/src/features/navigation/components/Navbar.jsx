import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneIcon from '@mui/icons-material/Tune';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';

export const Navbar = ({ isProductList = false }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleFilters = () => {
    dispatch(toggleFilters());
  };

  const settings = [
    { name: 'Home', to: '/' },
    { name: 'Profile', to: loggedInUser?.isAdmin ? '/admin/profile' : '/profile' },
    { name: loggedInUser?.isAdmin ? 'Orders' : 'My Orders', to: loggedInUser?.isAdmin ? '/admin/orders' : '/orders' },
    { name: 'Logout', to: '/logout' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'white',
        boxShadow: 'none',
        color: 'text.primary',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            textDecoration: 'none',
            fontSize: isMobile ? '1rem' : '1.5rem',
          }}
        >
          Happy Shopy
        </Typography>

        {/* Right Section */}
        <Stack direction="row" spacing={3} alignItems="center">
          {/* Admin Button */}
          {loggedInUser?.isAdmin && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ fontSize: '0.875rem', textTransform: 'none' }}
              component={Link}
              to="/admin/add-product"
            >
              Add Product
            </Button>
          )}

          {/* Wishlist & Cart Icons */}
          <Stack direction="row" spacing={2} alignItems="center">
            {!loggedInUser?.isAdmin && (
              <Badge badgeContent={wishlistItems?.length} color="error">
                <IconButton component={Link} to="/wishlist">
                  <FavoriteBorderIcon />
                </IconButton>
              </Badge>
            )}

            <Badge badgeContent={cartItems?.length} color="error">
              <IconButton onClick={() => navigate('/cart')}>
                <ShoppingCartOutlinedIcon />
              </IconButton>
            </Badge>
          </Stack>

          {/* Filters (Only for Product List Page) */}
          {isProductList && (
            <IconButton onClick={handleToggleFilters}>
              <TuneIcon sx={{ color: isProductFilterOpen ? 'primary.main' : '' }} />
            </IconButton>
          )}

          {/* Profile Avatar & Menu */}
          <Tooltip title="Account Settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={userInfo?.name} src="/static/images/avatar/1.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            sx={{ mt: '45px' }}
          >
            {settings.map((setting) => (
              <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                <Typography
                  component={Link}
                  to={setting.to}
                  sx={{ textDecoration: 'none', color: 'text.primary', width: '100%' }}
                >
                  {setting.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
