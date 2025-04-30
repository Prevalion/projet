import { Helmet } from 'react-helmet-async';

const Meta = ({
  title = 'Welcome To TechZone',
  description = 'We sell the best products for the best price',
  keywords = 'electronics, buy electronics, best price electronics',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

export default Meta;
