import React from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Comment } from '../../types/comment/comment';
import { REACT_APP_API_URL } from '../../config';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useTranslation } from 'next-i18next';

interface ReviewProps {
	comment: Comment;
}

const Review = (props: ReviewProps) => {
	const { comment } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const memberImage = comment?.memberData?.memberImage;
	const memberViews = comment?.memberData?.memberViews ?? 0;

	/** HANDLERS **/
	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};
	if (device === 'mobile') {
		return <div>REVIEW</div>;
	} else {
		return (
			<Stack className={'review-config'}>
				<Stack className={'review-mb-info'}>
					{memberImage ? (
						<img src={`${REACT_APP_API_URL}/${memberImage}`} alt="" className={'img-box'} />
					) : (
						<Stack className={'img-box img-box-fallback'}>
							<PersonRoundedIcon />
						</Stack>
					)}
					<Stack className={'review-right'}>
						<Stack className={'name-date-row'}>
							<Typography className={'name'} onClick={() => goMemberPage(comment?.memberData?._id as string)}>
								{comment.memberData?.memberNick}
							</Typography>
							<Stack className={'date-box'}>
								<CalendarTodayOutlinedIcon />
								<Typography className={'date'}>
									<Moment format={'MMM DD, YYYY'}>{comment.createdAt}</Moment>
								</Typography>
							</Stack>
						</Stack>
						<Stack className={'views-row'}>
							<RemoveRedEyeIcon />
							<Typography className={'view-count'}>
								{memberViews.toLocaleString()} {memberViews === 1 ? t('detail_view') : t('detail_views')}
							</Typography>
						</Stack>
						<Stack className={'desc-box'}>
							<Typography className={'description'}>{comment.commentContent}</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Review;
