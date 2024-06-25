import clsx from 'clsx';
import Lottie from 'lottie-react';

import loaderLottieFile from '~/assets/lottie/loader.json';

type LoaderProps = {
  className?: string;
};

const Loader = ({ className }: LoaderProps) => {
  return (
    <div className={clsx(className)}>
      <Lottie animationData={loaderLottieFile} />
    </div>
  );
};

export default Loader;
