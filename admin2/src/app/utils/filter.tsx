"use client"
import { PlusMini } from '@medusajs/icons';
import { Badge, IconButton } from '@medusajs/ui';
import React from 'react';

interface FilterProps {
  count: number;
  onAddFilter: () => void;
  label: string;
  badgeColor?: string;
}

const Filter: React.FC<FilterProps> = ({count}) => {
  return (
    <div className="flex flex-row justify-center items-center">
      <Badge rounded="base" size="xsmall" className='text-xsm font-semibold mr-2 p-2'>
        Filters<span className="text-purple-500">{count}</span>
      </Badge>
      <IconButton size="xsmall">
        <PlusMini />
      </IconButton>
    </div>
  );
};

export default Filter;
