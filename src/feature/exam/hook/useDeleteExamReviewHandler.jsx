import { useContext, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY, TOAST } from '@/shared/constant';
import { ModalContext } from '@/shared/context/ModalContext';
import { useAuth, useToast } from '@/shared/hook';

import { deleteExamReview } from '@/apis';

export function useDeleteExamReviewHandler() {
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
      const response = await deleteExamReview(postId);
      if (response.status === 200) {
        toast({ message: TOAST.EXAM_REVIEW.delete, variant: 'success' });
        navigate(-1);
        queryClient.removeQueries([QUERY_KEY.review, postId]);
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
