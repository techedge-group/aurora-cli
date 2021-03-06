import { FuseNavigationItem } from '@fuse/components/navigation';

export const kitchenSink: FuseNavigationItem = {
    id      : 'kitchenSink',
    title   : 'Kitchen Sink',
    type    : 'collapsable',
    icon    : 'heroicons_outline:newspaper',
    children: [
        {
            id   : 'decimals',
            title: 'Decimals',
            type : 'basic',
            icon : 'heroicons_outline:variable',
            link : '/kitchen-sink/decimals',
        },
        {
            id   : 'grid',
            title: 'Grid',
            type : 'basic',
            icon : 'heroicons_outline:view-list',
            link : '/kitchen-sink/grid',
        },
    ],
};