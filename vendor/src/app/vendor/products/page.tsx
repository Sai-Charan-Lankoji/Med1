'use client'

import withAuth from '@/lib/withAuth';

import React from 'react';
import Tabs from '../../utils/tabs';
import Collections from '../collections/page';
import Product from './productsPage/page';
import { Container } from '@medusajs/ui';

const Products: React.FC = () => {
  const tabs = [
    {
      label: 'Products',
      content: <Product />,
      isDefault: true,
    },
    {
      label: 'Collections',
      content: <Collections />,
    },
  ];

  return (
    <Container>
      <Tabs tabs={tabs} />
    </Container>
  );
};

export default withAuth(Products) ;
