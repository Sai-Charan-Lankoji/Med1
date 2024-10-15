'use client'

import React from 'react';
import Tabs from '../../utils/tabs';
import Order from './orderPage/page';
import Drafts from '../drafts/page';
import { Container } from '@medusajs/ui';  
import withAuth from '@/lib/withAuth';

const Orders: React.FC = () => {
  const tabs = [
    {
      label: 'Orders',
      content: <Order />,
      isDefault: true, 
    },
    {
      label: 'Drafts',
      content: <Drafts />,
    },
  ];

  return (
    <Container>
      <Tabs tabs={tabs} />
    </Container>
  );
};

export default withAuth(Orders);
