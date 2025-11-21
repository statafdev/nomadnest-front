"use client";
import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ListingCardProps {
  image: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  host: string;
  delay?: number;
}

const ListingCard = ({ image, title, location, price, rating, host, delay = 0 }: ListingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="shrink-0 w-80"
    >
      <Card className="overflow-hidden shadow-soft hover:shadow-float transition-smooth group cursor-pointer border-0">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 gradient-card">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight text-foreground line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>

          <div className="flex items-baseline justify-between pt-2 border-t border-border">
            <div>
              <span className="text-2xl font-handwritten font-bold text-primary">
                ${price}
              </span>
              <span className="text-sm text-muted-foreground"> / night</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Hosted by {host}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ListingCard;
