import React from 'react';
import { View } from 'react-native';
import { Star } from 'lucide-react-native';

const StarRating = ({ rating, size = 16, color = '#E5B635' }) => {
  const filledStars = Math.floor(rating);
  const totalStars = 5;

  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: totalStars }).map((_, index) => (
        <Star
          key={index}
          size={size}
          color={color}
          fill={index < filledStars ? color : 'none'} // ⭐ filled / outlined
        />
      ))}
    </View>
  );
};

export default StarRating;
