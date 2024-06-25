import { useQuery } from '@apollo/client';
import { useAtom, useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '~/components/Button';
import Loader from '~/components/Loader';
import {
  chosenProjectJsonUrlAtom,
  getProjectJsonAtom,
  saveNewProjectAtom,
} from '~/store/project';
import {
  PublicAnimation,
  PublicAnimationsQuery,
  getPublicAnimationsQuery,
} from '~/store/publicAnimation';

type FeaturedAnimationListProps = {};

const FeaturedAnimationList = ({}: FeaturedAnimationListProps) => {
  const navigate = useNavigate();

  const setChosenProjectUrl = useSetAtom(chosenProjectJsonUrlAtom);

  const [{ data: projectJsonData }] = useAtom(getProjectJsonAtom);
  const [{ mutateAsync: saveNewProjectMutate }] = useAtom(saveNewProjectAtom);

  const { data, loading, refetch } = useQuery<PublicAnimationsQuery>(
    getPublicAnimationsQuery,
    { variables: { after: '' }, notifyOnNetworkStatusChange: true }
  );

  const [publicAnimationsList, setPublicAnimationsList] = useState<
    Map<string, PublicAnimation['node']>
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

  const onChooseAnimation = (animation: PublicAnimation['node']) => {
    setChosenProjectUrl(animation.jsonUrl);
  };

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

  useEffect(() => {
    (async () => {
      if (projectJsonData) {
        const res = await saveNewProjectMutate({
          name: projectJsonData.nm,
          animation: projectJsonData,
        });

        if (res.data) {
          setChosenProjectUrl(RESET);
          navigate(`/project/${res.data?._id}`);
        }
      }
    })();
  }, [projectJsonData]);

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
                onClick={() => onChooseAnimation(publicAnimation)}
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
