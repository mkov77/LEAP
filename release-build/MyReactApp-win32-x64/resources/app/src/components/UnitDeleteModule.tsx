import React, { useEffect, useState } from 'react';
import { Modal, Button, Select, Loader, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';

interface UnitDeleteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Unit {
  //id: number;
  unit_id: string;
}

export default function UnitDeleteModule({ isOpen, onClose }: UnitDeleteProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);

  const form = useForm({
    initialValues: {
      unit_name: '',
    },
    validate: {
      unit_name: (value) => (value ? null : 'Unit selection is required'),
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch units with section as null
      const fetchUnits = async () => {
        try {
          setIsLoading(true);
          console.log("GYLGUILGUILGUIGUI:")
          const response = await axios.get<Unit[]>('http://localhost:5000/api/presetunits');
          console.log("sdvjk;: ", response)
          setUnits(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching units:', error);
          setIsLoading(false);
        }
      };
      fetchUnits();
    }
  }, [isOpen]);

  const handleSubmit = async (values: { unit_name: string })=> {

    console.log('Trying to delete ' + values.unit_name)

    try {
      setIsLoading(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      // Send delete request to the server
      await axios.delete(`http://localhost:5000/api/units/${values.unit_name}`);

      setSubmitSuccess(true);
      setIsLoading(false);
      form.reset();
    } catch (error) {
      console.error('Error deleting unit:', error);
      setSubmitError('Failed to delete unit');
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Delete a unit">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {form.errors.id && <Text color="red">{form.errors.id}</Text>}

        <Select
          label="Unit Name"
          placeholder="Select unit to delete"
          error={form.errors.id}
          searchable
          data={units.map(unit => ({ value: unit.unit_id, label: unit.unit_id }))}
          {...form.getInputProps('id')}
        />
        {form.errors.id && <Text color="red">{form.errors.id}</Text>}

        {/* data={units.map(unit => ({
  value: unit.unit_id || '', // Use a fallback if unit_id is undefined
  label: unit.unit_id || 'Unknown', // Use a fallback for the label as well
}))}
 */}

        {isLoading ? (
          <Loader size={24} />
        ) : (
          <>
            {submitError && <Text color="red">{submitError}</Text>}
            {submitSuccess && <Text color="green">Unit deleted successfully!</Text>}
            <Button type="submit" mt="md" color="red">
              Delete Unit
            </Button>
          </>
        )}
      </form>
    </Modal>
  );
}