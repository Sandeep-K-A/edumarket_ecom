import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProducts(params);

        if (!cancelled) {
          setProducts(data.data);
          setPagination(data.pagination);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load products");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(params)]);

  return {
    products,
    pagination,
    loading,
    error,
  };
};

export default useProducts;
