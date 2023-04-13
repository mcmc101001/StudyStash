import { FC } from 'react';

interface PageProps {
    params: {
        id: string;
    }
}

const Page:FC<PageProps> = ({ params }) => {
    return <div className='text-slate-700 dark:text-slate-300'>{params.id}</div>;
}

export default Page;