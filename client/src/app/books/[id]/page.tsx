import BookDetailsClient from './BookDetailsClient';

export function generateStaticParams() {
  return [
    { id: '65b801a1c9e77b001a111111' },
    { id: '65b801a1c9e77b001a222222' },
    { id: '65b801a1c9e77b001a333333' },
    { id: '65b801a1c9e77b001a444444' },
    { id: '65b801a1c9e77b001a555555' },
    { id: '65b801a1c9e77b001a666666' },
    { id: '65b801a1c9e77b001a777777' },
    { id: '65b801a1c9e77b001a888888' },
    { id: '65b801a1c9e77b001a999999' }
  ];
}

export default function BookDetailsPage() {
  return <BookDetailsClient />;
}
