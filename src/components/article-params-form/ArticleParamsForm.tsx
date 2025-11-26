import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { 
	defaultArticleState, 
	fontFamilyOptions, 
	fontColors, 
	backgroundColors, 
	contentWidthArr, 
	fontSizeOptions,
	ArticleStateType 
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	onApply?: (formState: ArticleStateType) => void;
	initialState?: ArticleStateType;
};

export const ArticleParamsForm = ({ 
	onApply, 
	initialState = defaultArticleState 
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [formState, setFormState] = useState<ArticleStateType>(initialState);
	const asideRef = useRef<HTMLElement>(null);

	const handleFormChange = <K extends keyof ArticleStateType>(
		key: K,
		value: ArticleStateType[K]
	) => {
		setFormState((prev: ArticleStateType) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		onApply?.(formState);
		setIsOpen(false);
	};

	const handleReset = () => {
		setFormState(initialState);
		onApply?.(initialState);
	};

	const handleArrowClick = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}
	}, [isOpen]);

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={handleArrowClick} />
			<aside
				ref={asideRef}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form className={styles.form} onSubmit={handleApply} onReset={handleReset}>
					<div className={styles.fontFamily}>
						<Select
							title='Шрифт'
							options={fontFamilyOptions}
							selected={formState.fontFamilyOption}
							onChange={(value) => handleFormChange('fontFamilyOption', value)}
						/>
					</div>

					<div className={styles.fontSize}>
						<RadioGroup
							name='font-size'
							title='Размер шрифта'
							options={fontSizeOptions}
							selected={formState.fontSizeOption}
							onChange={(value) => handleFormChange('fontSizeOption', value)}
						/>
					</div>

					<div className={styles.fontColor}>
						<Select
							title='Цвет шрифта'
							options={fontColors}
							selected={formState.fontColor}
							onChange={(value) => handleFormChange('fontColor', value)}
						/>
					</div>

					<div className={styles.backgroundColor}>
						<Select
							title='Цвет фона'
							options={backgroundColors}
							selected={formState.backgroundColor}
							onChange={(value) => handleFormChange('backgroundColor', value)}
						/>
					</div>

					<div className={styles.contentWidth}>
						<Select
							title='Ширина контента'
							options={contentWidthArr}
							selected={formState.contentWidth}
							onChange={(value) => handleFormChange('contentWidth', value)}
						/>
					</div>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};