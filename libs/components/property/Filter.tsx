import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	Slider,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { useTranslation } from 'next-i18next';

const DURATION_OPTIONS = [
	{ key: 'filter_duration_short', start: 1, end: 3 },
	{ key: 'filter_duration_week', start: 4, end: 7 },
	{ key: 'filter_duration_two_weeks', start: 8, end: 14 },
	{ key: 'filter_duration_long', start: 15, end: 365 },
];

const PRICE_MAX = 5000;

interface FilterType {
	searchFilter: PropertiesInquiry;
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('common');
	const [propertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
	const [propertyType] = useState<PropertyType[]>(Object.values(PropertyType));
	const [searchText, setSearchText] = useState<string>('');
	const [priceRange, setPriceRange] = useState<number[]>([
		searchFilter?.search?.pricesRange?.start ?? 0,
		searchFilter?.search?.pricesRange?.end ?? PRICE_MAX,
	]);
	const activeDurationKey = (() => {
		const r = searchFilter?.search?.periodsRange;
		if (!r) return '';
		return DURATION_OPTIONS.find((o) => o.start === r.start && o.end === r.end)?.key || '';
	})();

	// Reset all filters handler
	const handleResetFilters = async () => {
		setSearchText('');
		setPriceRange([0, PRICE_MAX]);
		setSearchFilter({
			page: 1,
			limit: initialInput?.limit || 9,
			search: {},
		});
		await router.push('/property', undefined, { scroll: false });
	};

	const handleDurationSelect = async (start: number, end: number, isActive: boolean) => {
		const next = isActive
			? { ...searchFilter, search: { ...searchFilter.search, periodsRange: undefined } }
			: { ...searchFilter, search: { ...searchFilter.search, periodsRange: { start, end } } };
		// strip undefined so it doesn't end up as null in the query string
		if (isActive) delete next.search.periodsRange;
		await router.push(
			`/property?input=${JSON.stringify(next)}`,
			`/property?input=${JSON.stringify(next)}`,
			{ scroll: false },
		);
	};

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			router.push(
				`/property?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
				`/property?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
				{ scroll: false },
			);
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router.push(
				`/property?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
				`/property?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
				{ scroll: false },
			);
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const propertyLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, propertyLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const handlePriceChange = (event: Event, newValue: number | number[]) => {
		setPriceRange(newValue as number[]);
	};

	const handlePriceCommitted = async (event: any, newValue: number | number[]) => {
		const val = newValue as number[];
		await router.push(
			`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
					pricesRange: { start: val[0], end: val[1] },
				},
			})}`,
			`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
					pricesRange: { start: val[0], end: val[1] },
				},
			})}`,
			{ scroll: false },
		);
	};

	if (device === 'mobile') {
		return <div>PROPERTIES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				{/* Filter header — title + reset */}
				<Stack className={'filter-head'} direction="row" alignItems="center" justifyContent="space-between">
					<Typography className={'filter-head-title'}>Filters</Typography>
					<Button
						className={'filter-reset-btn'}
						size="small"
						startIcon={<RestartAltOutlinedIcon />}
						onClick={handleResetFilters}
					>
						{t('filter_reset_all')}
					</Button>
				</Stack>

				{/* Search Destination */}
				<Stack className={'filter-section search-section'}>
					<Stack className={'section-head'} direction="row" alignItems="center">
						<SearchOutlinedIcon className={'section-icon'} />
						<Typography className={'section-title'}>{t('filter_search_destination')}</Typography>
					</Stack>
					<Stack className={'search-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={t('filter_search_placeholder')}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: {
											...searchFilter.search,
											text: searchText.trim().toLowerCase(),
										},
									});
								}
							}}
						/>
						<IconButton
							className={'search-btn'}
							onClick={() => {
								setSearchFilter({
									...searchFilter,
									search: {
										...searchFilter.search,
										text: searchText.trim().toLowerCase(),
									},
								});
							}}
						>
							<SearchIcon />
						</IconButton>
					</Stack>
				</Stack>

				{/* Tour Type */}
				<Stack className={'filter-section'}>
					<Stack className={'section-head'} direction="row" alignItems="center">
						<CategoryOutlinedIcon className={'section-icon'} />
						<Typography className={'section-title'}>{t('filter_tour_type')}</Typography>
					</Stack>
					<Stack className={'chip-list'} direction="row" flexWrap="wrap">
						{propertyType.map((type: string) => {
							const checked = (searchFilter?.search?.typeList || []).includes(type as PropertyType);
							return (
								<label
									key={type}
									htmlFor={`type-${type}`}
									className={`filter-chip ${checked ? 'is-active' : ''}`}
								>
									<input
										id={`type-${type}`}
										type="checkbox"
										value={type}
										onChange={propertyTypeSelectHandler}
										checked={checked}
										style={{ display: 'none' }}
									/>
									<span>{t(`tour_type_${type}`, { defaultValue: type })}</span>
								</label>
							);
						})}
					</Stack>
				</Stack>

				{/* Duration */}
				<Stack className={'filter-section'}>
					<Stack className={'section-head'} direction="row" alignItems="center">
						<AccessTimeOutlinedIcon className={'section-icon'} />
						<Typography className={'section-title'}>{t('filter_duration')}</Typography>
					</Stack>
					<Stack className={'chip-list'} direction="row" flexWrap="wrap">
						{DURATION_OPTIONS.map((opt) => {
							const isActive = activeDurationKey === opt.key;
							return (
								<button
									key={opt.key}
									type="button"
									className={`filter-chip ${isActive ? 'is-active' : ''}`}
									onClick={() => handleDurationSelect(opt.start, opt.end, isActive)}
								>
									<span>{t(opt.key)}</span>
								</button>
							);
						})}
					</Stack>
				</Stack>

				{/* Filter by Price */}
				<Stack className={'filter-section'}>
					<Stack className={'section-head'} direction="row" alignItems="center">
						<AttachMoneyOutlinedIcon className={'section-icon'} />
						<Typography className={'section-title'}>{t('filter_filter_by_price')}</Typography>
					</Stack>
					<Stack className={'price-slider-box'}>
						<Slider
							value={priceRange}
							onChange={handlePriceChange}
							onChangeCommitted={handlePriceCommitted}
							min={0}
							max={PRICE_MAX}
							step={50}
							sx={{
								color: '#e8a54b',
								'& .MuiSlider-thumb': {
									backgroundColor: '#fff',
									border: '3px solid #e8a54b',
									boxShadow: '0 4px 10px rgba(232, 165, 75, 0.32)',
									width: 20,
									height: 20,
									'&:hover, &.Mui-focusVisible': {
										boxShadow: '0 0 0 8px rgba(232, 165, 75, 0.18)',
									},
								},
								'& .MuiSlider-track': {
									background: 'linear-gradient(90deg, #f5a623 0%, #e8a54b 100%)',
									border: 'none',
									height: 6,
								},
								'& .MuiSlider-rail': {
									backgroundColor: '#f1dcc0',
									height: 6,
									opacity: 1,
								},
							}}
						/>
						<Stack className={'price-labels'} direction={'row'} justifyContent={'space-between'}>
							<span className="price-pill">${priceRange[0]}</span>
							<span className="price-pill">${priceRange[1]}</span>
						</Stack>
					</Stack>
				</Stack>

				{/* Popular Destination */}
				<Stack className={'filter-section'}>
					<Stack className={'section-head'} direction="row" alignItems="center">
						<PublicOutlinedIcon className={'section-icon'} />
						<Typography className={'section-title'}>{t('filter_popular_destination')}</Typography>
					</Stack>
					<Stack
						className={'checkbox-list destination-list'}
						sx={{
							maxHeight: '210px',
							overflow: 'hidden',
							transition: 'max-height 0.5s ease',
							'&:hover': {
								maxHeight: '400px',
							},
						}}
					>
						{propertyLocation.map((location: string) => (
							<Stack className={'checkbox-row'} key={location}>
								<Stack className={'checkbox-left'} direction={'row'} alignItems={'center'}>
									<Checkbox
										id={`loc-${location}`}
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as PropertyLocation)}
										onChange={propertyLocationSelectHandler}
										sx={{
											color: '#d6cab2',
											'&.Mui-checked': { color: '#e8a54b' },
											padding: '4px',
										}}
									/>
									<label htmlFor={`loc-${location}`} style={{ cursor: 'pointer' }}>
										<Typography className="checkbox-label">
											{t(`destination_${location}`, { defaultValue: location })}
										</Typography>
									</label>
								</Stack>
							</Stack>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
