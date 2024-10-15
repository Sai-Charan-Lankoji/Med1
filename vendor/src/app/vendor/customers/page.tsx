import React from 'react';
import Tabs from '../../utils/tabs';
import CustomerGroups from '../groups/page';
import Customer from './cusomerPage/page';
import { Container } from '@medusajs/ui';

const Customers: React.FC = () => {
  const tabs = [
    {
      label: 'Customers',
      content: <Customer />,
      isDefault: true, 
    },
    {
      label: 'Groups',
      content: <CustomerGroups />,
    },
  ];

  return (
    <Container>
      <Tabs tabs={tabs} />
    </Container>
  );
};

export default Customers;
