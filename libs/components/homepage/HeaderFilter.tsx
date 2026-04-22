import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { propertyYears } from '../../config';
import { PropertyLocation, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '12px',
  outline: 'none',
  boxShadow: 24,
};

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: '200px',
    },
  },
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
  initialInput: PropertiesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
  const { initialInput } = props;
  const device = useDeviceDetect();
  const { t, i18n } = useTranslation('common');
  const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
  const locationRef: any = useRef();
  const typeRef: any = useRef();
  const roomsRef: any = useRef();
  const dateRef: any = useRef();
  const router = useRouter();
  const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openRooms, setOpenRooms] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
  const [propertyType, setPropertyType] = useState<PropertyType[]>(Object.values(PropertyType));
  const [yearCheck, setYearCheck] = useState({ start: 1970, end: thisYear });
  const [optionCheck, setOptionCheck] = useState('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  /** LIFECYCLES **/
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!locationRef?.current?.contains(event.target)) {
        setOpenLocation(false);
      }
      if (!typeRef?.current?.contains(event.target)) {
        setOpenType(false);
      }
      if (!roomsRef?.current?.contains(event.target)) {
        setOpenRooms(false);
      }
      if (!dateRef?.current?.contains(event.target)) {
        setOpenDate(false);
      }
    };
    document.addEventListener('mousedown', clickHandler);
    return () => {
      document.removeEventListener('mousedown', clickHandler);
    };
  }, []);

  useEffect(() => {
    if (searchFilter?.search?.checkIn || searchFilter?.search?.checkOut) {
      setDateRange({
        start: searchFilter.search.checkIn ? format(new Date(searchFilter.search.checkIn), 'yyyy-MM-dd') : '',
        end: searchFilter.search.checkOut ? format(new Date(searchFilter.search.checkOut), 'yyyy-MM-dd') : '',
      });
    } else {
      setDateRange({ start: '', end: '' });
    }
  }, [searchFilter?.search?.checkIn, searchFilter?.search?.checkOut]);

  /** HANDLERS **/
  const advancedFilterHandler = (status: boolean) => {
    setOpenLocation(false);
    setOpenRooms(false);
    setOpenType(false);
    setOpenDate(false);
    setOpenAdvancedFilter(status);
  };

  const locationStateChangeHandler = () => {
    setOpenLocation((prev) => !prev);
    setOpenRooms(false);
    setOpenType(false);
    setOpenDate(false);
  };

  const typeStateChangeHandler = () => {
    setOpenType((prev) => !prev);
    setOpenLocation(false);
    setOpenRooms(false);
    setOpenDate(false);
  };

  const roomStateChangeHandler = () => {
    setOpenRooms((prev) => !prev);
    setOpenType(false);
    setOpenLocation(false);
    setOpenDate(false);
  };

  const dateStateChangeHandler = () => {
    setOpenDate((prev) => !prev);
    setOpenRooms(false);
    setOpenType(false);
    setOpenLocation(false);
  };

  const disableAllStateHandler = () => {
    setOpenRooms(false);
    setOpenType(false);
    setOpenLocation(false);
    setOpenDate(false);
  };

  const propertyLocationSelectHandler = useCallback(
    async (value: any) => {
      try {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            locationList: [value],
          },
        });
        typeStateChangeHandler();
      } catch (err: any) {
        console.log('ERROR, propertyLocationSelectHandler:', err);
      }
    },
    [searchFilter],
  );

  const propertyTypeSelectHandler = useCallback(
    async (value: any) => {
      try {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            typeList: [value],
          },
        });
        roomStateChangeHandler();
      } catch (err: any) {
        console.log('ERROR, propertyTypeSelectHandler:', err);
      }
    },
    [searchFilter],
  );

  const propertyRoomSelectHandler = useCallback(
    async (value: any) => {
      try {
        setSearchFilter({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            roomsList: [value],
          },
        });
        disableAllStateHandler();
      } catch (err: any) {
        console.log('ERROR, propertyRoomSelectHandler:', err);
      }
    },
    [searchFilter],
  );

  const propertyBedSelectHandler = useCallback(
    async (number: Number) => {
      try {
        if (number != 0) {
          if (searchFilter?.search?.bedsList?.includes(number)) {
            setSearchFilter({
              ...searchFilter,
              search: {
                ...searchFilter.search,
                bedsList: searchFilter?.search?.bedsList?.filter((item: Number) => item !== number),
              },
            });
          } else {
            setSearchFilter({
              ...searchFilter,
              search: { ...searchFilter.search, bedsList: [...(searchFilter?.search?.bedsList || []), number] },
            });
          }
        } else {
          delete searchFilter?.search.bedsList;
          setSearchFilter({ ...searchFilter });
        }
      } catch (err: any) {
        console.log('ERROR, propertyBedSelectHandler:', err);
      }
    },
    [searchFilter],
  );

  const propertyOptionSelectHandler = useCallback(
    async (e: any) => {
      try {
        const value = e.target.value;
        setOptionCheck(value);
        if (value !== 'all') {
          setSearchFilter({
            ...searchFilter,
            search: {
              ...searchFilter.search,
              options: [value],
            },
          });
        } else {
          delete searchFilter.search.options;
          setSearchFilter({
            ...searchFilter,
            search: { ...searchFilter.search },
          });
        }
      } catch (err: any) {
        console.log('ERROR, propertyOptionSelectHandler:', err);
      }
    },
    [searchFilter],
  );

  const handleDateChange = (value: string, type: 'start' | 'end') => {
    const nextRange = { ...dateRange, [type]: value } as { start: string; end: string };
    if (type === 'end' && nextRange.start && value && new Date(value) < new Date(nextRange.start)) {
      nextRange.start = value;
    }
    if (type === 'start' && nextRange.end && value && new Date(value) > new Date(nextRange.end)) {
      nextRange.end = value;
    }
    setDateRange(nextRange);
    const newSearch = {
      ...searchFilter.search,
      checkIn: nextRange.start || undefined,
      checkOut: nextRange.end || undefined,
    };
    if (!nextRange.start) delete newSearch.checkIn;
    if (!nextRange.end) delete newSearch.checkOut;
    setSearchFilter({ ...searchFilter, search: newSearch });
  };

  const clearDateHandler = () => {
    setDateRange({ start: '', end: '' });
    const newSearch = { ...searchFilter.search };
    delete newSearch.checkIn;
    delete newSearch.checkOut;
    setSearchFilter({ ...searchFilter, search: newSearch });
  };

  // Removed propertySquareHandler and all propertySquare logic

  const yearStartChangeHandler = async (event: any) => {
    setYearCheck({ ...yearCheck, start: Number(event.target.value) });
    setSearchFilter({
      ...searchFilter,
      search: {
        ...searchFilter.search,
        periodsRange: { start: Number(event.target.value), end: yearCheck.end },
      },
    });
  };

  const yearEndChangeHandler = async (event: any) => {
    setYearCheck({ ...yearCheck, end: Number(event.target.value) });
    setSearchFilter({
      ...searchFilter,
      search: {
        ...searchFilter.search,
        periodsRange: { start: yearCheck.start, end: Number(event.target.value) },
      },
    });
  };

  const resetFilterHandler = () => {
    setSearchFilter(initialInput);
    setOptionCheck('all');
    setYearCheck({ start: 1970, end: thisYear });
    setDateRange({ start: '', end: '' });
  };

  const pushSearchHandler = async () => {
    try {
      if (searchFilter?.search?.locationList?.length == 0) delete searchFilter.search.locationList;
      if (searchFilter?.search?.typeList?.length == 0) delete searchFilter.search.typeList;
      if (searchFilter?.search?.roomsList?.length == 0) delete searchFilter.search.roomsList;
      if (searchFilter?.search?.options?.length == 0) delete searchFilter.search.options;
      if (searchFilter?.search?.bedsList?.length == 0) delete searchFilter.search.bedsList;
      if (!searchFilter?.search?.checkIn || !searchFilter?.search?.checkOut) {
        delete searchFilter.search.checkIn;
        delete searchFilter.search.checkOut;
      }
      if (!searchFilter?.search?.periodsRange?.start || !searchFilter?.search?.periodsRange?.end) {
        delete searchFilter.search.periodsRange;
      }
      await router.push(`/property?input=${JSON.stringify(searchFilter)}`);
    } catch (err: any) {
      console.log('ERROR, pushSearchHandler:', err);
    }
  };

  if (device === 'mobile') {
    return <div>HEADER FILTER MOBILE</div>;
  } else {
    return (
      <>
        <Stack className={'search-box'}>
          <Stack className={'select-box'}>
            {/* Destination */}
            <Box component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler}>
              <Box className={'box-icon'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#e8a54b" />
                </svg>
              </Box>
              <Box className={'box-text'}>
                <span className={'box-label'}>{t('destination_label')}</span>
                <span className={'box-value'}>
                  {searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('destination_placeholder')}
                </span>
              </Box>
              <ExpandMoreIcon className={'box-arrow'} />
            </Box>

            <div className={'divider-line'} />

            {/* Tour Type */}
            <Box component={'div'} className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
              <Box className={'box-icon'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b" />
                </svg>
              </Box>
              <Box className={'box-text'}>
                <span className={'box-label'}>{t('tourtype_label')}</span>
                <span className={'box-value'}>
                  {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('tourtype_placeholder')}
                </span>
              </Box>
              <ExpandMoreIcon className={'box-arrow'} />
            </Box>

            <div className={'divider-line'} />

            {/* Check In - Check Out */}
            <Box component={'div'} className={`box ${openDate ? 'on' : ''}`} onClick={dateStateChangeHandler}>
              <Box className={'box-icon'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM9 12H7V10H9V12ZM13 12H11V10H13V12ZM17 12H15V10H17V12ZM9 16H7V14H9V16ZM13 16H11V14H13V16ZM17 16H15V14H17V16Z" fill="#e8a54b" />
                </svg>
              </Box>
              <Box className={'box-text'}>
                <span className={'box-label'}>{t('checkinout_label')}</span>
                <span className={'box-value'}>
                  {dateRange.start && dateRange.end
                    ? `${format(new Date(dateRange.start), 'MMM d')} - ${format(new Date(dateRange.end), 'MMM d')}`
                    : t('checkinout_placeholder')}
                </span>
              </Box>
              <ExpandMoreIcon className={'box-arrow'} />
            </Box>

            <div className={'divider-line'} />

            {/* Total Guests */}
            <Box component={'div'} className={`box ${openRooms ? 'on' : ''}`} onClick={roomStateChangeHandler}>
              <Box className={'box-icon'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="#e8a54b" />
                </svg>
              </Box>
              <Box className={'box-text'}>
                <span className={'box-label'}>{t('guests_label')}</span>
                <span className={'box-value'}>
                  {searchFilter?.search?.roomsList ? `${searchFilter?.search?.roomsList[0]} ${t('guests_unit')}` : t('guests_placeholder')}
                </span>
              </Box>
              <ExpandMoreIcon className={'box-arrow'} />
            </Box>
          </Stack>

          {/* SEARCH BUTTON */}
{/* SEARCH BUTTON */}
<div className="search-btn" onClick={pushSearchHandler}>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="white" />
  </svg>
</div>

          {/* MENUS */}
          <div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
            {/* Special entry for Turkey with external link and ideal image */}
        
      
            {/* Render the rest of the locations as before */}
            {propertyLocation.map((location: string) => (
              <div onClick={() => propertyLocationSelectHandler(location)} key={location}>
               
			   
			    <img src={`img/banner/cities/${location}.webp`} alt={location} style={{ width: '100%', borderRadius: '20px', display: 'block' }} />
                <span style={{ display: 'block', textAlign: 'center', marginTop: '8px', fontWeight: 500 }}>{location}</span>
              </div>
            ))}
          </div>

          <div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
            {propertyType.map((type: string) => (
              <div
                style={{ backgroundImage: `url(/img/banner/types/${type.toLowerCase()}.webp)` }}
                onClick={() => propertyTypeSelectHandler(type)}
                key={type}
              >
                <span>{type}</span>
              </div>
            ))}
          </div>

          <div className={`filter-rooms ${openRooms ? 'on' : ''}`} ref={roomsRef}>
            {[1, 2, 3, 4, 5].map((room: number) => (
              <span onClick={() => propertyRoomSelectHandler(room)} key={room}>
                {room} guest{room > 1 ? 's' : ''}
              </span>
            ))}
          </div>

          <div className={`filter-date ${openDate ? 'on' : ''}`} ref={dateRef}>
            <div className={'date-grid'}>
              <label>
                <span>Check in</span>
                <input type="date" value={dateRange.start} onChange={(e) => handleDateChange(e.target.value, 'start')} />
              </label>
              <label>
                <span>Check out</span>
                <input type="date" value={dateRange.end} onChange={(e) => handleDateChange(e.target.value, 'end')} />
              </label>
            </div>
            <div className={'date-actions'}>
              <button className={'clear-btn'} onClick={clearDateHandler} type={'button'}>
                Clear
              </button>
              <Button className={'apply-btn'} onClick={() => disableAllStateHandler()} variant={'contained'}>
                Apply
              </Button>
            </div>
          </div>
        </Stack>

        {/* ADVANCED FILTER MODAL */}
        <Modal
          open={openAdvancedFilter}
          onClose={() => advancedFilterHandler(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {/* @ts-ignore */}
          <Box sx={style}>
            <Box className={'advanced-filter-modal'}>
              <div className={'close'} onClick={() => advancedFilterHandler(false)}>
                <CloseIcon />
              </div>
              <div className={'top'}>
                <span>Search Destination</span>
                <div className={'search-input-box'}>
                  <img src="/img/icons/search.svg" alt="" />
                  <input
                    value={searchFilter?.search?.text ?? ''}
                    type="text"
                    placeholder={'What are you looking for?'}
                    onChange={(e: any) => {
                      setSearchFilter({
                        ...searchFilter,
                        search: { ...searchFilter.search, text: e.target.value },
                      });
                    }}
                  />
                </div>
              </div>

              <Divider sx={{ mt: '30px', mb: '35px' }} />

              <div className={'middle'}>
                <div className={'row-box'}>
                  <div className={'box'}>
                    <span>bedrooms</span>
                    <div className={'inside'}>
                      <div
                        className={`room ${!searchFilter?.search?.bedsList ? 'active' : ''}`}
                        onClick={() => propertyBedSelectHandler(0)}
                      >
                        Any
                      </div>
                      {[1, 2, 3, 4, 5].map((bed: number) => (
                        <div
                          className={`room ${searchFilter?.search?.bedsList?.includes(bed) ? 'active' : ''}`}
                          onClick={() => propertyBedSelectHandler(bed)}
                          key={bed}
                        >
                          {bed}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={'box'}>
                    <span>options</span>
                    <div className={'inside'}>
                      <FormControl>
                        <Select
                          value={optionCheck}
                          onChange={propertyOptionSelectHandler}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem value={'all'}>All Options</MenuItem>
                          <MenuItem value={'propertyBarter'}>Barter</MenuItem>
                          <MenuItem value={'propertyRent'}>Rent</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>

                <div className={'row-box'} style={{ marginTop: '44px' }}>
                  <div className={'box'}>
                    <span>Year Built</span>
                    <div className={'inside space-between align-center'}>
                      <FormControl sx={{ width: '122px' }}>
                        <Select
                          value={yearCheck.start.toString()}
                          onChange={yearStartChangeHandler}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          MenuProps={MenuProps}
                        >
                          {propertyYears?.slice(0)?.map((year: number) => (
                            <MenuItem value={year} disabled={yearCheck.end <= year} key={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <div className={'minus-line'}></div>
                      <FormControl sx={{ width: '122px' }}>
                        <Select
                          value={yearCheck.end.toString()}
                          onChange={yearEndChangeHandler}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          MenuProps={MenuProps}
                        >
                          {propertyYears
                            ?.slice(0)
                            .reverse()
                            .map((year: number) => (
                              <MenuItem value={year} disabled={yearCheck.start >= year} key={year}>
                                {year}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <div className={'box'}>
                    {/* Removed propertySquare UI */}
                  </div>
                </div>
              </div>

              <Divider sx={{ mt: '60px', mb: '18px' }} />

              <div className={'bottom'}>
                <div onClick={resetFilterHandler}>
                  <img src="/img/icons/reset.svg" alt="" />
                  <span>Reset all filters</span>
                </div>
                <Button
                  startIcon={<img src={'/img/icons/search.svg'} />}
                  className={'search-btn'}
                  onClick={pushSearchHandler}
                >
                  Search
                </Button>
              </div>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }
};

HeaderFilter.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    search: {
      squaresRange: {
        start: 0,
        end: 500,
      },
      pricesRange: {
        start: 0,
        end: 2000000,
      },
    },
  },
};

export default HeaderFilter;