namespace APIhl.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public double ImdbRating { get; set; }
        public int Year { get; set; }
    }
}