import { motion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode } from 'react';

type OnboardingSlideProps = {
  title: string;
  description: string;
  imageSrc: string;
  color: string;
  icon?: ReactNode;
  direction?: 'left' | 'right';
};

const OnboardingSlide = ({
  title,
  description,
  imageSrc,
  color,
  icon,
  direction = 'right',
}: OnboardingSlideProps) => {
  return (
    <motion.div
      className="h-full w-full flex flex-col justify-between p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex-1 flex items-center justify-center mb-8">
        <motion.div
          initial={{ x: direction === 'right' ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative h-64 w-64"
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain"
          />
          
          {icon && (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-lg"
            >
              {icon}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className={`text-2xl font-bold mb-2 ${color}`}>{title}</h2>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingSlide;