import React, { useMemo } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from '@apollo/client';
import { Box, Stack, Typography, Avatar, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_MEMBERS_BY_ADMIN, GET_ALL_PROPERTIES_BY_ADMIN } from '../../../apollo/admin/query';
import { Member } from '../../../libs/types/member/member';
import { Property } from '../../../libs/types/property/property';
import { MemberStatus, MemberType } from '../../../libs/enums/member.enum';
import { REACT_APP_API_URL } from '../../../libs/config';

const TYPE_COLORS: Record<string, string> = {
	ADMIN: '#7c3aed',
	AGENT: '#ea580c',
	USER: '#0891b2',
};

interface DonutSlice {
	label: string;
	value: number;
	color: string;
}

const Donut: React.FC<{ slices: DonutSlice[]; size?: number; thickness?: number }> = ({
	slices,
	size = 168,
	thickness = 22,
}) => {
	const total = slices.reduce((s, x) => s + x.value, 0) || 1;
	const radius = (size - thickness) / 2;
	const circumference = 2 * Math.PI * radius;
	let offset = 0;

	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg">
			<circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(15,23,42,0.06)" strokeWidth={thickness} />
			{slices.map((s, i) => {
				const dash = (s.value / total) * circumference;
				const seg = (
					<circle
						key={s.label + i}
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke={s.color}
						strokeWidth={thickness}
						strokeDasharray={`${dash} ${circumference - dash}`}
						strokeDashoffset={-offset}
						strokeLinecap="butt"
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
					/>
				);
				offset += dash;
				return seg;
			})}
			<text x={size / 2} y={size / 2 - 4} textAnchor="middle" className="donut-center-num">
				{total}
			</text>
			<text x={size / 2} y={size / 2 + 16} textAnchor="middle" className="donut-center-lbl">
				TOTAL
			</text>
		</svg>
	);
};

const Sparkline: React.FC<{ values: number[]; max?: number; height?: number }> = ({
	values,
	height = 90,
}) => {
	if (!values.length) return null;
	const w = 480;
	const h = height;
	const max = Math.max(1, ...values);
	const stepX = w / Math.max(1, values.length - 1);
	const points = values.map((v, i) => `${i * stepX},${h - (v / max) * (h - 12) - 6}`);
	const path = `M ${points.join(' L ')}`;
	const area = `${path} L ${w},${h} L 0,${h} Z`;
	return (
		<svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="spark-svg">
			<defs>
				<linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#f5a623" stopOpacity={0.32} />
					<stop offset="100%" stopColor="#f5a623" stopOpacity={0} />
				</linearGradient>
			</defs>
			<path d={area} fill="url(#spark-fill)" />
			<path d={path} fill="none" stroke="#f5a623" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
			{values.map((v, i) => (
				<circle
					key={i}
					cx={i * stepX}
					cy={h - (v / max) * (h - 12) - 6}
					r={3}
					fill="#fff"
					stroke="#f5a623"
					strokeWidth={2}
				/>
			))}
		</svg>
	);
};

const AdminReports: NextPage = () => {
	const { t } = useTranslation('common');
	const { data: membersData, loading: membersLoading } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { page: 1, limit: 500, sort: 'createdAt', search: {} } },
	});
	const { data: propsData, loading: propsLoading } = useQuery(GET_ALL_PROPERTIES_BY_ADMIN, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { page: 1, limit: 200, sort: 'propertyViews', direction: 'DESC', search: {} } },
	});

	const members: Member[] = membersData?.getAllMembersByAdmin?.list ?? [];
	const properties: Property[] = propsData?.getAllPropertiesByAdmin?.list ?? [];

	/* ── KPI numbers ── */
	const kpis = useMemo(() => {
		const today = new Date();
		const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
		const dayMs = 86400000;
		const last7 = startOfToday - 6 * dayMs;
		const last30 = startOfToday - 29 * dayMs;
		const newToday = members.filter((m) => new Date(m.createdAt).getTime() >= startOfToday).length;
		const newWeek = members.filter((m) => new Date(m.createdAt).getTime() >= last7).length;
		const newMonth = members.filter((m) => new Date(m.createdAt).getTime() >= last30).length;
		const active = members.filter((m) => m.memberStatus === MemberStatus.ACTIVE).length;
		const inactive = members.length - active;
		return { newToday, newWeek, newMonth, active, inactive, total: members.length };
	}, [members]);

	/* ── 14-day registration trend ── */
	const trend = useMemo(() => {
		const days = 14;
		const today = new Date();
		const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
		const buckets = new Array(days).fill(0);
		const labels: string[] = [];
		for (let i = days - 1; i >= 0; i--) {
			const d = new Date(startToday - i * 86400000);
			labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
		}
		members.forEach((m) => {
			const t = new Date(m.createdAt).getTime();
			const diffDays = Math.floor((startToday - new Date(t).setHours(0, 0, 0, 0)) / 86400000);
			if (diffDays >= 0 && diffDays < days) buckets[days - 1 - diffDays] += 1;
		});
		return { labels, values: buckets };
	}, [members]);

	/* ── Type distribution ── */
	const typeSlices: DonutSlice[] = useMemo(() => {
		const counts: Record<string, number> = {};
		members.forEach((m) => {
			const k = m.memberType || 'USER';
			counts[k] = (counts[k] || 0) + 1;
		});
		return Object.entries(counts).map(([label, value]) => ({
			label,
			value,
			color: TYPE_COLORS[label] || '#94a3b8',
		}));
	}, [members]);

	/* ── Top 10 active users (by points + views) ── */
	const topUsers = useMemo(() => {
		return [...members]
			.sort(
				(a, b) =>
					(b.memberPoints || 0) + (b.memberViews || 0) - ((a.memberPoints || 0) + (a.memberViews || 0)),
			)
			.slice(0, 10);
	}, [members]);

	/* ── Top destinations ── */
	const topByViews = useMemo(() => [...properties].sort((a, b) => (b.propertyViews || 0) - (a.propertyViews || 0)).slice(0, 5), [properties]);
	const topByLikes = useMemo(() => [...properties].sort((a, b) => (b.propertyLikes || 0) - (a.propertyLikes || 0)).slice(0, 5), [properties]);
	const topByRank = useMemo(
		() =>
			[...properties]
				.sort(
					(a, b) =>
						((b.propertyLikes || 0) + (b.propertyViews || 0) * 0.5) -
						((a.propertyLikes || 0) + (a.propertyViews || 0) * 0.5),
				)
				.slice(0, 5),
		[properties],
	);

	const loading = membersLoading || propsLoading;
	const maxView = Math.max(1, ...topByViews.map((p) => p.propertyViews || 0));
	const maxLike = Math.max(1, ...topByLikes.map((p) => p.propertyLikes || 0));
	const maxRank = Math.max(1, ...topByRank.map((p) => (p.propertyLikes || 0) + (p.propertyViews || 0) * 0.5));

	return (
		<Box component="div" className="content reports-page">
			<Typography variant="h2" className="tit" sx={{ mb: '24px' }}>
				{t('admin_reports_title')}
			</Typography>

			{/* USER REPORTS section */}
			<Typography className="reports-section-title">📊 {t('admin_reports_section_users')}</Typography>

			<Stack className="kpi-row" direction="row">
				<Stack className="kpi-card kpi--total">
					<Typography className="kpi-label">{t('admin_reports_kpi_new_today')}</Typography>
					<Typography className="kpi-value">{kpis.newToday}</Typography>
					<Typography className="kpi-delta"><TrendingUpIcon fontSize="inherit" /> {t('admin_reports_kpi_daily')}</Typography>
				</Stack>
				<Stack className="kpi-card kpi--active">
					<Typography className="kpi-label">{t('admin_reports_kpi_new_week')}</Typography>
					<Typography className="kpi-value">{kpis.newWeek}</Typography>
					<Typography className="kpi-delta"><TrendingUpIcon fontSize="inherit" /> {t('admin_reports_kpi_weekly')}</Typography>
				</Stack>
				<Stack className="kpi-card kpi--privileged">
					<Typography className="kpi-label">{t('admin_reports_kpi_new_month')}</Typography>
					<Typography className="kpi-value">{kpis.newMonth}</Typography>
					<Typography className="kpi-delta"><TrendingUpIcon fontSize="inherit" /> {t('admin_reports_kpi_monthly')}</Typography>
				</Stack>
				<Stack className="kpi-card kpi--blocked">
					<Typography className="kpi-label">{t('admin_reports_kpi_total')}</Typography>
					<Typography className="kpi-value">{kpis.total}</Typography>
					<Typography className="kpi-delta"><TrendingUpIcon fontSize="inherit" /> {t('admin_reports_kpi_all_time')}</Typography>
				</Stack>
			</Stack>

			<Stack className="reports-grid" direction="row">
				{/* Trend card */}
				<Stack className="report-card report-card--trend">
					<Stack className="card-head" direction="row">
						<Typography className="card-title">{t('admin_reports_trend_title')}</Typography>
						<Typography className="card-sub">{t('admin_reports_trend_total', { count: trend.values.reduce((s, x) => s + x, 0) })}</Typography>
					</Stack>
					<Sparkline values={trend.values} />
					<Stack className="trend-axis" direction="row">
						<span>{trend.labels[0]}</span>
						<span>{trend.labels[Math.floor(trend.labels.length / 2)]}</span>
						<span>{trend.labels[trend.labels.length - 1]}</span>
					</Stack>
				</Stack>

				{/* Active vs inactive donut */}
				<Stack className="report-card report-card--ratio">
					<Stack className="card-head" direction="row">
						<Typography className="card-title">{t('admin_reports_ratio_title')}</Typography>
					</Stack>
					<Stack className="ratio-body" direction="row">
						<Donut
							slices={[
								{ label: t('admin_reports_ratio_active'), value: kpis.active, color: '#10b981' },
								{ label: t('admin_reports_ratio_inactive'), value: kpis.inactive, color: '#cbd5e1' },
							]}
						/>
						<Stack className="ratio-legend">
							<Stack className="legend-row" direction="row">
								<span className="legend-dot" style={{ background: '#10b981' }} />
								<Typography className="legend-label">{t('admin_reports_ratio_active')}</Typography>
								<Typography className="legend-value">{kpis.active}</Typography>
							</Stack>
							<Stack className="legend-row" direction="row">
								<span className="legend-dot" style={{ background: '#cbd5e1' }} />
								<Typography className="legend-label">{t('admin_reports_ratio_inactive')}</Typography>
								<Typography className="legend-value">{kpis.inactive}</Typography>
							</Stack>
							<Typography className="legend-hint">
								{t('admin_reports_ratio_hint', { pct: kpis.total > 0 ? Math.round((kpis.active / kpis.total) * 100) : 0 })}
							</Typography>
						</Stack>
					</Stack>
				</Stack>

				{/* Type distribution */}
				<Stack className="report-card report-card--types">
					<Stack className="card-head" direction="row">
						<Typography className="card-title">{t('admin_reports_types_title')}</Typography>
					</Stack>
					<Stack className="ratio-body" direction="row">
						<Donut slices={typeSlices} />
						<Stack className="ratio-legend">
							{typeSlices.map((s) => (
								<Stack key={s.label} className="legend-row" direction="row">
									<span className="legend-dot" style={{ background: s.color }} />
									<Typography className="legend-label">{s.label}</Typography>
									<Typography className="legend-value">{s.value}</Typography>
								</Stack>
							))}
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			{/* Top users */}
			<Stack className="report-card report-card--list" sx={{ mb: 4 }}>
				<Stack className="card-head" direction="row">
					<Typography className="card-title">{t('admin_reports_top_users_title')}</Typography>
					<Typography className="card-sub">{t('admin_reports_top_users_sub')}</Typography>
				</Stack>
				<Stack className="leaderboard">
					{topUsers.length === 0 && !loading && (
						<Typography className="empty">{t('admin_reports_no_data')}</Typography>
					)}
					{topUsers.map((u, i) => {
						const score = (u.memberPoints || 0) + (u.memberViews || 0);
						const max = Math.max(
							1,
							(topUsers[0]?.memberPoints || 0) + (topUsers[0]?.memberViews || 0),
						);
						const pct = (score / max) * 100;
						return (
							<Stack key={u._id} className="board-row" direction="row">
								<Typography className="board-rank">#{i + 1}</Typography>
								<Avatar
									className="board-avatar"
									src={u.memberImage ? `${REACT_APP_API_URL}/${u.memberImage}` : '/img/profile/defaultUser.svg'}
								/>
								<Stack className="board-meta">
									<Typography className="board-name">{u.memberNick}</Typography>
									<Typography className="board-sub">
										{u.memberType} · {u.memberPhone}
									</Typography>
									<LinearProgress className="board-bar" variant="determinate" value={pct} />
								</Stack>
								<Stack className="board-stats">
									<Stack direction="row" className="stat">
										<StarBorderIcon fontSize="inherit" /> {u.memberPoints || 0}
									</Stack>
									<Stack direction="row" className="stat">
										<VisibilityOutlinedIcon fontSize="inherit" /> {u.memberViews || 0}
									</Stack>
								</Stack>
							</Stack>
						);
					})}
				</Stack>
			</Stack>

			{/* DESTINATION REPORTS */}
			<Typography className="reports-section-title">🗺️ {t('admin_reports_section_destinations')}</Typography>

			<Stack className="reports-grid" direction="row">
				<Stack className="report-card report-card--list">
					<Stack className="card-head" direction="row">
						<Typography className="card-title">{t('admin_reports_most_viewed')}</Typography>
						<VisibilityOutlinedIcon className="card-head-icon" />
					</Stack>
					<Stack className="bar-list">
						{topByViews.map((p) => {
							const pct = ((p.propertyViews || 0) / maxView) * 100;
							return (
								<Link key={p._id} href={`/property/detail?id=${p._id}`}>
									<Stack className="bar-row">
										<Stack className="bar-row-top" direction="row">
											<Typography className="bar-name">{p.propertyTitle}</Typography>
											<Typography className="bar-num">{p.propertyViews || 0}</Typography>
										</Stack>
										<Stack className="bar-track">
											<Stack className="bar-fill bar-fill--view" sx={{ width: `${pct}%` }} />
										</Stack>
									</Stack>
								</Link>
							);
						})}
						{topByViews.length === 0 && !loading && <Typography className="empty">{t('admin_reports_no_data')}</Typography>}
					</Stack>
				</Stack>

				<Stack className="report-card report-card--list">
					<Stack className="card-head" direction="row">
						<Typography className="card-title">{t('admin_reports_most_loved')}</Typography>
						<FavoriteBorderIcon className="card-head-icon" />
					</Stack>
					<Stack className="bar-list">
						{topByLikes.map((p) => {
							const pct = ((p.propertyLikes || 0) / maxLike) * 100;
							return (
								<Link key={p._id} href={`/property/detail?id=${p._id}`}>
									<Stack className="bar-row">
										<Stack className="bar-row-top" direction="row">
											<Typography className="bar-name">{p.propertyTitle}</Typography>
											<Typography className="bar-num">{p.propertyLikes || 0}</Typography>
										</Stack>
										<Stack className="bar-track">
											<Stack className="bar-fill bar-fill--like" sx={{ width: `${pct}%` }} />
										</Stack>
									</Stack>
								</Link>
							);
						})}
						{topByLikes.length === 0 && !loading && <Typography className="empty">{t('admin_reports_no_data')}</Typography>}
					</Stack>
				</Stack>

				<Stack className="report-card report-card--list">
					<Stack className="card-head" direction="row">
						<Typography className="card-title">{t('admin_reports_top_score')}</Typography>
						<StarBorderIcon className="card-head-icon" />
					</Stack>
					<Stack className="bar-list">
						{topByRank.map((p) => {
							const score = (p.propertyLikes || 0) + (p.propertyViews || 0) * 0.5;
							const pct = (score / maxRank) * 100;
							return (
								<Link key={p._id} href={`/property/detail?id=${p._id}`}>
									<Stack className="bar-row">
										<Stack className="bar-row-top" direction="row">
											<Typography className="bar-name">{p.propertyTitle}</Typography>
											<Typography className="bar-num">{Math.round(score)}</Typography>
										</Stack>
										<Stack className="bar-track">
											<Stack className="bar-fill bar-fill--rank" sx={{ width: `${pct}%` }} />
										</Stack>
									</Stack>
								</Link>
							);
						})}
						{topByRank.length === 0 && !loading && <Typography className="empty">{t('admin_reports_no_data')}</Typography>}
					</Stack>
				</Stack>
			</Stack>
		</Box>
	);
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

export default withAdminLayout(AdminReports);
