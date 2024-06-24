import { unified } from 'unified';
import relottieParse, { type Options } from '@lottiefiles/relottie-parse';

const parseOptions: Options = {
  position: false,
};

export const lottieParser = unified().use(relottieParse, parseOptions);
