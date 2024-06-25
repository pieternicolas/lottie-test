import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';

import Button from '~/components/Button';
import Loader from '~/components/Loader';
import {
  PublicAnimation,
  PublicAnimationsQuery,
  getPublicAnimationsQuery,
} from '~/store/publicAnimation';

type FeaturedAnimationListProps = {};

const FeaturedAnimationList = ({}: FeaturedAnimationListProps) => {
  const { data, loading, refetch } = useQuery<PublicAnimationsQuery>(
    getPublicAnimationsQuery,
    { variables: { after: '' }, notifyOnNetworkStatusChange: true }
  );

  const [publicAnimationsList, setPublicAnimationsList] = useState<
    Map<
      string,
      {
        jsonUrl: string;
        gifUrl: string;
        name: string;
      }
    >
  >(new Map());

  const paginationData = useMemo(() => {
    if (!data?.featuredPublicAnimations?.pageInfo) {
      return null;
    }

    return {
      hasNextPage: data.featuredPublicAnimations.pageInfo.hasNextPage,
      endCursor: data.featuredPublicAnimations.pageInfo.endCursor,
      startCursor: data.featuredPublicAnimations.pageInfo.startCursor,
      hasPreviousPage: data.featuredPublicAnimations.pageInfo.hasPreviousPage,
      totalCount: data.featuredPublicAnimations.totalCount,
    };
  }, [data]);

  useEffect(() => {
    if (data?.featuredPublicAnimations?.edges) {
      setPublicAnimationsList(
        new Map([
          ...Array.from(publicAnimationsList),
          ...data.featuredPublicAnimations.edges.map(
            (edge: PublicAnimation) =>
              [
                edge.node.jsonUrl,
                {
                  jsonUrl: edge.node.jsonUrl,
                  gifUrl: edge.node.gifUrl,
                  name: edge.node.name,
                },
              ] as const
          ),
        ])
      );
    }
  }, [data]);

  return (
    <>
      <div className="max-h-[80vh] min-h-[300px] overflow-y-auto relative">
        {loading && publicAnimationsList.size === 0 ? (
          <Loader className="w-full h-full" />
        ) : (
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[...publicAnimationsList.values()].map((publicAnimation) => (
              <div
                key={publicAnimation.jsonUrl}
                className="bg-white hover:shadow cursor-pointer rounded"
              >
                <img src={publicAnimation.gifUrl} alt={publicAnimation.name} />
              </div>
            ))}

            <Button
              className="col-span-3"
              disabled={loading || !paginationData?.hasNextPage}
              onClick={() => {
                refetch({
                  after: paginationData?.endCursor,
                });
              }}
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default FeaturedAnimationList;
