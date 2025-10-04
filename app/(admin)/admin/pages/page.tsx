'use client';
import ProgramsTable from '@/components/admin/Programs/ProgramsTable';
import Pagination from '@/components/shared/Pagination';

function ProgramsListPage() {
	return (
		<div>
			<ProgramsTable
				renderPagination={({ currentPage, totalPages, changePage }) => (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						changePage={changePage}
					/>
				)}
			/>
		</div>
	);
};

export default ProgramsListPage
