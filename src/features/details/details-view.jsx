import React from 'react';
import PropTypes from 'prop-types';
import styles from './details.module.css';

const DetailsView = ({
	background
}) => (
	<section className={styles.section}>
		<details className={styles.details}>
			<summary className={styles.summary}>Background</summary>
			{background}
		</details>
	</section>
);

DetailsView.propTypes = {
	background: PropTypes.string
}
export default DetailsView;
