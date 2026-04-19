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

interface FilterType {
	searchFilter: PropertiesInquiry;
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

// Tour type labels for travel theme
const tourTypeLabels: Record<string, string> = {
	CITY: 'City & Culture',
	BATCH: 'Beach & Sunset',
	LUXRY: 'Luxury & Romance',
};



// Destination labels
const destinationLabels: Record<string, string> = {
	UZBEKISTAN: 'Tashkent, Samarkhand',
	BANGKOK: 'Bangkok, Thailand',
	PARIS: 'Paris, France',
	COSTA_RICA: 'Costa Rica, America',
	SINGAPORE: 'Singapore, Asia',
	DUBAI: 'Dubai, United Arab Emirates',
	TOKYO: 'Tokyo, Japan',
	KOREA: 'Seoul, Korea',
	LONDON: 'London, England',
	BALI: 'Bali, Indonesia',
	TURKEY: 'Istanbul, Turkey',
};



const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [propertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
	const [propertyType] = useState<PropertyType[]>(Object.values(PropertyType));
	const [searchText, setSearchText] = useState<string>('');
	const [priceRange, setPriceRange] = useState<number[]>([
		searchFilter?.search?.pricesRange?.start ?? 100,
		searchFilter?.search?.pricesRange?.end ?? 500,
	]);

	// Reset all filters handler
	const handleResetFilters = async () => {
		setSearchText('');
		setPriceRange([0, 2000]);
		setSearchFilter({
			page: 1,
			limit: initialInput?.limit || 9,
			search: {},
		});
		await router.push('/property', undefined, { scroll: false });
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
				{/* Reset All Filters Button */}
				<Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
					<Button variant="outlined" size="small" color="warning" onClick={handleResetFilters}>
						Reset All Filters
					</Button>
				</Stack>
				{/* Search Destination */}
				<Stack className={'filter-section search-section'}>
					<Typography className={'section-title'}>Search Destination</Typography>
					<Stack className={'search-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'Search Here...'}
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
					<Typography className={'section-title'}>Tour Type</Typography>
					<Stack className={'checkbox-list'}>
						{propertyType.map((type: string) => (
							<Stack className={'checkbox-row'} key={type}>
								<Stack className={'checkbox-left'} direction={'row'} alignItems={'center'}>
									<Checkbox
										id={`type-${type}`}
										size="small"
										value={type}
										onChange={propertyTypeSelectHandler}
										checked={(searchFilter?.search?.typeList || []).includes(type as PropertyType)}
										sx={{
											color: '#ccc',
											'&.Mui-checked': { color: '#e8a54b' },
											padding: '4px',
										}}
									/>
									<label htmlFor={`type-${type}`} style={{ cursor: 'pointer' }}>
										<Typography className="checkbox-label">
											{tourTypeLabels[type] || type}
										</Typography>
									</label>
								</Stack>
							</Stack>
						))}
					</Stack>
				</Stack>

				{/* Filter by Price */}
				<Stack className={'filter-section'}>
					<Typography className={'section-title'}>Filter by Price</Typography>
					<Stack className={'price-slider-box'}>
						<Slider
							value={priceRange}
							onChange={handlePriceChange}
							onChangeCommitted={handlePriceCommitted}
							min={0}
							max={2000}
							sx={{
								color: '#e8a54b',
								'& .MuiSlider-thumb': {
									backgroundColor: '#e8a54b',
									border: '3px solid #fff',
									boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
									width: 18,
									height: 18,
								},
								'& .MuiSlider-track': {
									backgroundColor: '#e8a54b',
									height: 5,
								},
								'& .MuiSlider-rail': {
									backgroundColor: '#e0d5c8',
									height: 5,
								},
							}}
						/>
						<Stack className={'price-labels'} direction={'row'} justifyContent={'space-between'}>
							<span>${priceRange[0]}</span>
							<span>${priceRange[1]}</span>
						</Stack>
					</Stack>
				</Stack>

				{/* Popular Destination */}
				<Stack className={'filter-section'}>
					<Typography className={'section-title'}>Popular Destination</Typography>
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
											color: '#ccc',
											'&.Mui-checked': { color: '#e8a54b' },
											padding: '4px',
										}}
									/>
									<label htmlFor={`loc-${location}`} style={{ cursor: 'pointer' }}>
										<Typography className="checkbox-label">
											{destinationLabels[location] || location}
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
