import unittest

from app.chunking import chunk_text


class ChunkingTest(unittest.TestCase):
    def test_window_starts_are_linear_not_geometric(self):
        text = "abcdefghij" * 30  # 300 chars
        chunks = chunk_text(text, source="f.txt", page=1, window=100, overlap=20)
        # step = window - overlap = 80  ->  starts at 0, 80, 160, 240
        self.assertEqual([c.start for c in chunks], [0, 80, 160, 240])

    def test_overlap_is_respected(self):
        text = "x" * 300
        chunks = chunk_text(text, source="f.txt", page=1, window=100, overlap=20)
        # chunk 0 ends at 100, chunk 1 starts at 80 -> 20 chars overlap
        self.assertEqual(chunks[0].end - chunks[1].start, 20)

    def test_last_chunk_bounded_to_text_length(self):
        text = "x" * 300
        chunks = chunk_text(text, source="f.txt", page=1, window=100, overlap=20)
        self.assertEqual(chunks[-1].end, 300)

    def test_metadata_shape_and_none_page(self):
        chunk = chunk_text("hello world", "f.txt", page=None, window=100, overlap=10)[0]
        meta = chunk.metadata()
        self.assertEqual(meta["source"], "f.txt")
        self.assertEqual(meta["page"], -1)  # None coerced (Chroma rejects None)
        self.assertEqual((meta["start"], meta["end"]), (0, 11))

    def test_ids_are_unique_and_stable(self):
        chunks = chunk_text("x" * 300, "f.txt", page=1, window=100, overlap=20)
        ids = [c.id for c in chunks]
        self.assertEqual(len(ids), len(set(ids)))

    def test_whitespace_only_is_skipped(self):
        self.assertEqual(chunk_text("     ", "f.txt", window=50, overlap=5), [])

    def test_invalid_params(self):
        with self.assertRaises(ValueError):
            chunk_text("x", "f.txt", window=10, overlap=10)
        with self.assertRaises(ValueError):
            chunk_text("x", "f.txt", window=0, overlap=0)


if __name__ == "__main__":
    unittest.main()
