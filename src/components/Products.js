import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import {useSnackbar} from "notistack";
import React, { useState } from "react";
import { useEffect } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart"
import {generateCartItemsFrom} from "./Cart"


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
const[Products,setProducts]=useState();
const[cartData,setCartData]=useState();
const[loading,setLoading]=useState(true);
const[searchProduct,setSearchProduct]=useState();
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * 
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
   
   const performAPICall = async () => {
    try{
      const productData=await axios.get(`${config.endpoint}/products`);
    setProducts(productData.data);
   //console.log(productData.data);
   setLoading(false);
  } catch (error) {
    console.error(error);
  }
   };
   

   

   useEffect(()=>{
    performAPICall();
   },[]);

   const token = localStorage.getItem('token');

   useEffect(() => {
    // console.log("I am called")
    fetchCart(token)
      .then((cardData) => generateCartItemsFrom(cardData, Products))
      .then((cartItems) => setCartData(cartItems));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Products]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
   const performSearch = async (text) => {
    try{
      const filteredProductData=await axios.get(`${config.endpoint}/products/search?value=${text}`);
      //console.log(filteredProductData);
      setProducts(filteredProductData.data);
    }
    catch(error){
      console.log(error);
      setProducts([]);
    }
 
  };


  const handleSearchBox=(e)=>{
    const searchText=e.target.value;
    setSearchProduct(searchText);
    performSearch(searchText);
  }
 

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
   let timerId = null;
  const debounceSearch = (event, debounceTimeout) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    //console.log(debounceTimeout);
    timerId = setTimeout(()=>{handleSearchBox(event)},debounceTimeout);
    
  };
  

/**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
 const fetchCart = async (token) => {
  if (!token) return; 
  try {
    // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    const cartData = await axios.get(`${config.endpoint}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    //console.log("ans",cartData.data);
    return cartData.data;
  } catch (e) {
    if (e.response && e.response.status === 400) {
      console.log(e.response.data.message, { variant: "error" });
    } else {
      console.log(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
      );
    }
    return null;
  }
};


// TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
/**
 * Return if a product already is present in the cart
 *
 * @param { Array.<{ productId: String, quantity: Number }> } items
 *    Array of objects with productId and quantity of products in cart
 * @param { String } productId
 *    Id of a product to be checked
 *
 * @returns { Boolean }
 *    Whether a product of given "productId" exists in the "items" array
 *
 */
const isItemInCart = (items, productId) => {
  return(cartData.some(product => product.productId === productId));
};

/**
 * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
 *
 * @param {string} token
 *    Authentication token returned on login
 * @param { Array.<{ productId: String, quantity: Number }> } items
 *    Array of objects with productId and quantity of products in cart
 * @param { Array.<Product> } products
 *    Array of objects with complete data on all available products
 * @param {string} productId
 *    ID of the product that is to be added or updated in cart
 * @param {number} qty
 *    How many of the product should be in the cart
 * @param {boolean} options
 *    If this function was triggered from the product card's "Add to Cart" button
 *
 * Example for successful response from backend:
 * HTTP 200 - Updated list of cart items
 * [
 *      {
 *          "productId": "KCRwjF7lN97HnEaY",
 *          "qty": 3
 *      },
 *      {
 *          "productId": "BW0jAAeDJmlZCF8i",
 *          "qty": 1
 *      }
 * ]
 *
 * Example for failed response from backend:
 * HTTP 404 - On invalid productId
 * {
 *      "success": false,
 *      "message": "Product doesn't exist"
 * }
 */
// function handleAdd(e){
//   //addToCart(localStorage.getItem("token"),items,products,item.producid,item.qty+1);
// }
//  function handleDelete(e){
//   console.log("e");
// }

const { enqueueSnackbar } = useSnackbar();

const addToCart = async (token,items,products,productId,qty,options) => {
 
 if(!localStorage.getItem("username")){
  enqueueSnackbar("Login to add an item to the Cart", {
    variant: "error",
 })}
 else{
  // console.log("h",isItemInCart(items,productId));
  // console.log("h2",options);
  if((isItemInCart(items,productId)&&options)){
  enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", {
    variant: "error",
 })
}
  else{
    try{
    const response=await axios.post(`${config.endpoint}/cart`, {
    "productId": productId,
    "qty": qty
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
   
  const a=generateCartItemsFrom(response.data, Products);
  setCartData(a);
   enqueueSnackbar('Successfully added to cart');
}  catch (error) {
   console.error(error);
   }
  }
 }
};


  return (
    <div>
      <Header hasHiddenAuthButtons={false} children={debounceSearch}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchProduct}
        onChange={(e)=>{debounceSearch(e,500)}}
        // (e)=>{debounceSearch(e,500)}
      />
       <Grid container>
       <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
           </Grid>
         
         {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
          <p style={{ marginLeft: '10px' }}>Loading Products</p>
        </div>
      ) : Products.length===0?(
        <div className="search">
        <SentimentDissatisfied color="inherit" />
        <p>No products Found</p>
      </div>
      )
      :(
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Products.map((product) => (
            <ProductCard key={product._id} product={product} handleAddToCart={addToCart}/>
          ))}
        </div>
      )}
        {localStorage.getItem("username") && (
        <Grid item md={4} xs={12} sm={12}>    
        {/* className="cart-desktop"> */}
          <Cart products={Products} items = {cartData} handleQuantity={addToCart}/>
          </Grid>
      )}
       </Grid>
      <Footer />
    </div>
  );
};

export default Products;
