import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star, MapPin, Heart, Share2, Flag, User, Shield, Truck, ArrowLeft } from 'lucide-react';

// Mock data - replace with your actual data fetching
const getListing = (listingId: string) => {
  // In a real app, you would fetch this from your API
  const listings = [
    {
      id: '1',
      title: 'iPhone 13 Pro Max - 256GB - Brand New',
      price: 899,
      originalPrice: 999,
      description: 'Brand new iPhone 13 Pro Max in Graphite. Still sealed in original packaging with 1-year Apple warranty. Includes all original accessories.',
      location: 'New York, NY',
      category: 'Electronics',
      condition: 'New',
      brand: 'Apple',
      model: 'iPhone 13 Pro Max',
      images: [
        'https://images.unsplash.com/photo-1633893679936-4c34f8acd7a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1634195130430-2d1d58e9b103?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1633894584280-544f0c7f5a2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      ],
      rating: 4.8,
      reviews: 124,
      postedDate: '2023-06-15',
      seller: {
        id: 'user123',
        name: 'John Doe',
        rating: 4.9,
        memberSince: '2021-03-15',
        listings: 24,
        isVerified: true,
      },
      specifications: [
        { name: 'Storage', value: '256GB' },
        { name: 'Color', value: 'Graphite' },
        { name: 'Screen Size', value: '6.7"' },
        { name: 'Battery', value: '4352 mAh' },
        { name: 'Camera', value: 'Triple 12MP' },
        { name: 'Processor', value: 'A15 Bionic' },
      ],
    },
    // Add more mock listings...
  ];
  
  return listings.find(listing => listing.id === listingId);
};

export async function generateMetadata({ params }: { params: { listingId: string } }): Promise<Metadata> {
  const listing = getListing(params.listingId);
  
  if (!listing) {
    return {
      title: 'Listing Not Found',
    };
  }
  
  return {
    title: `${listing.title} - MarketPlace`,
    description: listing.description.substring(0, 160),
    openGraph: {
      images: [listing.images[0]],
    },
  };
}

export default function ListingPage({ params }: { params: { listingId: string } }) {
  const listing = getListing(params.listingId);
  
  if (!listing) {
    notFound();
  }

  const { 
    title, 
    price, 
    originalPrice,
    description, 
    location, 
    category, 
    condition, 
    brand, 
    model, 
    images, 
    rating, 
    reviews, 
    postedDate,
    seller,
    specifications
  } = listing;

  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  const postedDateFormatted = new Date(postedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <Link href="/categories" className="hover:text-blue-600">Categories</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <Link href={`/categories/${category.toLowerCase()}`} className="hover:text-blue-600">{category}</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
        <span className="text-gray-900 font-medium line-clamp-1">{title}</span>
      </nav>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Images */}
        <div className="lg:w-1/2">
          <div className="sticky top-4">
            <div className="relative aspect-square w-full bg-gray-100 rounded-xl overflow-hidden mb-4">
              <Image
                src={images[0]}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {discount}% OFF
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button 
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
                >
                  <Image
                    src={image}
                    alt={`${title} - ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Details */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>Listed {postedDateFormatted}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {location}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold text-gray-900">${price.toLocaleString()}</span>
              {originalPrice > price && (
                <span className="ml-2 text-lg text-gray-500 line-through">${originalPrice.toLocaleString()}</span>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex">
                  <span className="text-gray-500 w-32">Condition</span>
                  <span className="text-gray-900 font-medium">{condition}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Brand</span>
                  <span className="text-gray-900 font-medium">{brand}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Model</span>
                  <span className="text-gray-900 font-medium">{model}</span>
                </div>
                {specifications.map((spec, index) => (
                  <div key={index} className="flex">
                    <span className="text-gray-500 w-32">{spec.name}</span>
                    <span className="text-gray-900 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{seller.name}</span>
                    {seller.isVerified && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-medium text-gray-900">{seller.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{seller.listings} listings</span>
                    <span className="mx-1">•</span>
                    <span>Member since {new Date(seller.memberSince).getFullYear()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <Link 
                  href={`/stores/${seller.id}`}
                  className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  View Store
                </Link>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Contact Seller
                </button>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 mr-2" />
                  Save
                </button>
                <button className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Truck className="w-5 h-5 mr-2" />
                  Buy Now
                </button>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Free shipping available • 30-day returns • Secure payment</p>
              </div>
            </div>
          </div>
          
          {/* Delivery & Returns */}
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Delivery & Returns</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex">
                <div className="text-blue-600 mr-3">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Free Shipping</h4>
                  <p className="text-sm text-gray-500 mt-1">Free standard shipping on all orders</p>
                </div>
              </div>
              <div className="flex">
                <div className="text-blue-600 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">30-Day Returns</h4>
                  <p className="text-sm text-gray-500 mt-1">30-day return policy for most items</p>
                </div>
              </div>
              <div className="flex">
                <div className="text-blue-600 mr-3">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Secure Payment</h4>
                  <p className="text-sm text-gray-500 mt-1">Your payment information is processed securely</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Items */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Similar Listings</h2>
          <Link href={`/categories/${category.toLowerCase()}`} className="text-blue-600 hover:text-blue-800 flex items-center">
            View all in {category} <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* You would map through similar listings here */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="relative h-48 bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1633894584280-544f0c7f5a2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Similar item"
                fill
                className="object-cover"
              />
              <button className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                iPhone 13 Pro - 128GB - Excellent Condition
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Los Angeles, CA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">$749</span>
                <span className="text-xs text-gray-400">2 days ago</span>
              </div>
            </div>
          </div>
          
          {/* Add more similar items... */}
        </div>
      </div>
    </div>
  );
}
