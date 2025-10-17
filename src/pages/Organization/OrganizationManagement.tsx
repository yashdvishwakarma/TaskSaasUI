import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Typography,
  CircularProgress,
  Tooltip,
  TextField,
  InputAdornment,
  Fade,
  Skeleton,
  Snackbar,
  Alert,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";
import { Organization, orgApi } from "../../api/organization/organizationApis";
import AddOrganizationModal from "./AddOrganizationModal";
import EditOrganizationModal from "./EditOrganizationModal";
import ConfirmDialog from "../../components/Common/ConfirmDialog";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

const OrganizationManagement: React.FC = () => {
  const theme = useTheme();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await orgApi.getOrganizations(page + 1, rowsPerPage);
      setOrganizations(response.data);
      setTotalCount(response.totalCount);
    } catch (err) {
      showSnackbar("Failed to load organizations", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page, rowsPerPage]);

  const filteredOrganizations = useMemo(() => {
    if (!searchQuery) return organizations;

    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [organizations, searchQuery]);

  const showSnackbar = (
    message: string,
    severity: SnackbarState["severity"] = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddOrganization = async (data: any) => {
    try {
      await orgApi.createOrganization(data);
      setAddModalOpen(false);
      fetchOrganizations();
      showSnackbar("Organization created successfully");
    } catch (err: any) {
      if (err.response?.status === 409) {
        throw new Error("An organization with this name already exists");
      }
      throw err;
    }
  };

  const handleEditOrganization = async (data: any) => {
    if (!selectedOrg) return;

    try {
      data = {...data, id : selectedOrg.id};
      await orgApi.updateOrganization(selectedOrg.id, data);
      setEditModalOpen(false);
      setSelectedOrg(null);
      fetchOrganizations();
      showSnackbar("Organization updated successfully");
    } catch (err: any) {
      if (err.response?.status === 409) {
        throw new Error("An organization with this name already exists");
      }
      throw err;
    }
  };

  const handleDeleteOrganization = async () => {
    if (!selectedOrg) return;

    try {
      await orgApi.deleteOrganization(selectedOrg.id);
      setDeleteDialogOpen(false);
      setSelectedOrg(null);
      fetchOrganizations();
      showSnackbar("Organization deleted successfully");
    } catch (err) {
      showSnackbar("Failed to delete organization", "error");
    }
  };

  const openEditModal = (org: Organization) => {
    setSelectedOrg(org);
    setEditModalOpen(true);
  };

  const openDeleteDialog = (org: Organization) => {
    setSelectedOrg(org);
    setDeleteDialogOpen(true);
  };

  const getPlanChipColor = (plan: string): any => {
    switch (plan.toLowerCase()) {
      case "enterprise":
        return "error";
      case "professional":
        return "primary";
      case "starter":
        return "secondary";
      default:
        return "default";
    }
  };

  const renderSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton variant="text" width="80%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="60%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={80} height={24} />
          </TableCell>
          <TableCell align="center">
            <Skeleton variant="text" width={30} />
          </TableCell>
          <TableCell align="center">
            <Skeleton variant="rectangular" width={70} height={24} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="60%" />
          </TableCell>
          <TableCell align="right">
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <Fade in timeout={300}>
      <Box>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: "visible",
          }}
        >
          {/* Header Toolbar */}
          <Box
            sx={{
              p: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <BusinessIcon
                  sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Organizations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage all organizations in your system
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    minWidth: 300,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setAddModalOpen(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                  }}
                >
                  Add Organization
                </Button> */}
              </Stack>
            </Stack>
          </Box>

          {/* Table Content */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Plan</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Users
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  renderSkeleton()
                ) : filteredOrganizations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box py={8}>
                        <BusinessIcon
                          sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                        />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          gutterBottom
                        >
                          {searchQuery
                            ? "No organizations found"
                            : "No organizations yet"}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          {searchQuery
                            ? "Try adjusting your search criteria"
                            : 'Click "Add Organization" to create your first organization'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrganizations.map((org, index) => (
                    <TableRow
                      key={org.id}
                      hover
                      sx={{
                        "&:nth-of-type(even)": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.02
                          ),
                        },
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.04
                          ),
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {org.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {org.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`${org.plan} Plan`} arrow>
                          <Chip
                            label={org.plan}
                            size="small"
                            color={getPlanChipColor(org.plan)}
                            variant="outlined"
                            sx={{ borderRadius: 1.5, fontWeight: 500 }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={0.5}
                        >
                          <Typography variant="body2" fontWeight={500}>
                            {org.userCount}
                          </Typography>
                          <Tooltip
                            title="Total users in this organization"
                            arrow
                          >
                            <InfoIcon
                              sx={{ fontSize: 16, color: "text.disabled" }}
                            />
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={org.isActive ? "Active" : "Disabled"}
                          size="small"
                          color={org.isActive ? "success" : "default"}
                          sx={{
                            minWidth: 80,
                            borderRadius: 1.5,
                            fontWeight: 500,
                            bgcolor: org.isActive
                              ? alpha(theme.palette.success.main, 0.1)
                              : alpha(theme.palette.grey[500], 0.1),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(org.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Edit organization" arrow>
                            <IconButton
                              size="small"
                              onClick={() => openEditModal(org)}
                              sx={{
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {/*<Tooltip title="Delete organization" arrow>
                            <IconButton
                              size="small"
                              onClick={() => openDeleteDialog(org)}
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.1
                                  ),
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip> */}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && filteredOrganizations.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
            />
          )}
        </Card>

        {/* Modals */}
        <AddOrganizationModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddOrganization}
        />

        <EditOrganizationModal
          open={editModalOpen}
          organization={selectedOrg}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedOrg(null);
          }}
          onSubmit={handleEditOrganization}
        />

        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Organization"
          message={`Are you sure you want to delete "${selectedOrg?.name}"? This action will disable the organization and prevent user access.`}
          confirmText="Delete"
          confirmColor="error"
          onConfirm={handleDeleteOrganization}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setSelectedOrg(null);
          }}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default OrganizationManagement;
