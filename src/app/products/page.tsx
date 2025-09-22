'use client';

import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {DefaultApi, ProductsGet200ResponseInner} from "@/api-client";
import config from "../../../configuration";


interface Product extends ProductsGet200ResponseInner {
    rating?: {
        rate: number;
        count: number;
    };
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        const api = new DefaultApi(config);

        (async () => {
            try {
                const response = await api.productsGet();
                if (!mountedRef.current) return;
                setProducts(response.data as Product[]);
            } catch (err) {
                if (!mountedRef.current) return;
                setError('خطا در دریافت محصولات');
                console.error('Error:', err);
            } finally {
                if (mountedRef.current) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            mountedRef.current = false;
        };
    }, []);

    if (error) return (
        <div className="alert alert-danger text-center my-5">
            {error}
        </div>
    );

    return (
        <main className="container py-5" dir="rtl">
            <h1 className="text-center mb-5 fw-bold text-primary">محصولات فروشگاه</h1>

            <div className="row g-4">
                {loading ? (
                    [...Array(8)].map((_, index) => (
                        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="card h-100">
                                <Skeleton height={200} />
                                <div className="card-body">
                                    <Skeleton count={2} />
                                    <div className="mt-3">
                                        <Skeleton width={100} height={30} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="card h-100 shadow-sm hover-shadow">
                                <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                    <img
                                        src={product.image || '/placeholder-product.jpg'}
                                        alt={product.title}
                                        className="img-fluid p-3"
                                        style={{ maxHeight: '100%', maxWidth: '100%' }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                                        }}
                                    />
                                </div>

                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{product.title}</h5>

                                    {/* ⭐ بخش امتیاز */}
                                    <div className="mb-3">
                                        <div className="text-warning">
                                            {[...Array(5)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    className={`bi bi-star${i < Math.floor(product.rating?.rate || 0) ? '-fill' : ''}`}
                                                ></i>
                                            ))}
                                        </div>
                                        <small className="text-muted">({product.rating?.count || 0} نظر)</small>
                                    </div>

                                    <div className="mt-auto d-flex justify-content-between align-items-center">
                                        <span className="h5 text-success mb-0">${product.price}</span>
                                        <button className="btn btn-primary btn-sm">
                                            <i className="bi bi-cart-plus"></i> افزودن
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
