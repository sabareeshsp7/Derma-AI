"use client"

import Image from "next/image"
import { ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type MedicalProduct } from "./medical-products"

interface ProductDetailProps {
  product: MedicalProduct | null
  open: boolean
  onClose: () => void
  onAddToCart: (product: MedicalProduct) => void
}

export function ProductDetail({ product, open, onClose, onAddToCart }: ProductDetailProps) {
  if (!product) return null

  const discountedPrice = product.discount ? (product.price * (100 - product.discount)) / 100 : product.price
  const originalPrice = product.discount ? product.price / (1 - product.discount / 100) : product.price

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-700">Product Details</DialogTitle>
          <DialogDescription>View detailed product information and specifications</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg border-2 border-emerald-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.discount && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white">
                  {product.discount}% OFF
                </Badge>
              )}
              {product.requiresPrescription && (
                <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
                  Prescription Required
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="destructive">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              {product.brand && (
                <p className="text-sm text-emerald-600 font-medium uppercase tracking-wide mb-1">
                  {product.brand}
                </p>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({Math.floor(Math.random() * 100) + 50} reviews)
                </span>
              </div>
            </div>

            <Separator className="bg-emerald-100" />

            {/* Price Section */}
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-emerald-700">₹{discountedPrice.toFixed(2)}</div>
                  {product.discount && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
                      <Badge className="bg-red-500 text-white">Save ₹{(originalPrice - discountedPrice).toFixed(2)}</Badge>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => onAddToCart(product)} 
                  disabled={!product.inStock}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-emerald-50">
                <TabsTrigger value="description" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Description
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Details
                </TabsTrigger>
                <TabsTrigger value="usage" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Usage
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4 mt-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold text-emerald-700 mb-2">Key Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Clinically tested and proven effective</li>
                      <li>Fast-acting formula for quick relief</li>
                      <li>Made with premium quality ingredients</li>
                      <li>No known adverse side effects</li>
                      <li>Suitable for long-term use</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-emerald-700">Brand</h4>
                    <p className="text-gray-700">{product.brand || "Derma AI Healthcare"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-emerald-700">Category</h4>
                    <p className="text-gray-700 capitalize">{product.category || "General Medicine"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-emerald-700">Contents</h4>
                    <p className="text-gray-700">{product.contents || "Standard packaging"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-emerald-700">Prescription</h4>
                    <p className="text-gray-700">{product.requiresPrescription ? "Required" : "Not Required"}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Directions for Use</h4>
                    <p className="text-blue-700">
                      Take one tablet/capsule daily with water, preferably with meals or as directed by your healthcare
                      professional. Do not exceed the recommended dosage.
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-2">Important Precautions</h4>
                    <ul className="list-disc list-inside space-y-1 text-amber-700">
                      <li>Keep out of reach of children</li>
                      <li>Store in a cool, dry place away from direct sunlight</li>
                      <li>Consult your doctor if pregnant or nursing</li>
                      <li>Discontinue use if any adverse reactions occur</li>
                      <li>Check expiry date before use</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

