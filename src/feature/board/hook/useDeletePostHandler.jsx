import { useContext, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY, TOAST } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';
import { useAuth, useToast } from '@/shared/hook';

import { deleteEvent, deletePost } from '@/apis';

export function useDeletePostHandler(boardId, currentBoardTextId) {
  const { postId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { invalidUserInfoQuery } = useAuth();
  const { setModal } = useContext(ModalContext);

  const submitDisabledRef = useRef(false);

  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleDelete = async () => {
    if (submitDisabledRef.current) return;
    submitDisabledRef.current = true;
    setSubmitDisabled(true);

    try {
      const response =
        boardId === 14 && currentBoardTextId === 'event'
          ? await deleteEvent(postId)
          : await deletePost(boardId, postId);

      if (response.status === 200) {
        [21, 22].includes(boardId)
          ? toast({ message: TOAST.POST.delete, variant: 'success' })
          : toast({ message: TOAST.POST.deleteNoPoints, variant: 'success' });

        navigate(-1);
        queryClient.removeQueries(QUERY_KEY.post(postId));
        invalidUserInfoQuery();
      }
    } catch ({ response }) {
      toast({ message: response.data.message });
    } finally {
      submitDisabledRef.current = false;
      setSubmitDisabled(false);
      setModal({ id: null, type: null });
    }
  };

  return { handleDelete, submitDisabled };
}
