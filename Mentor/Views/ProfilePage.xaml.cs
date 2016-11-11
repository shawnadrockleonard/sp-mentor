using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.Storage.Pickers;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Mentor.Domain;
using Mentor.Data;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace Mentor.Views
{
	/// <summary>
	/// An empty page that can be used on its own or navigated to within a Frame.
	/// </summary>
	public sealed partial class ProfilePage : Page
	{
		public ProfilePage()
		{
			this.InitializeComponent();					
		}

		public List<Career> Careers
		{
			get
			{
				if (DataCache.Instance.Careers == null)
				{
					DataCache.Instance.Careers = DataFacade.Instance.GetCareers();
				}

				return DataCache.Instance.Careers;
			}
		}

		public List<Country> Countries
		{
			get
			{
				if (DataCache.Instance.Countries == null)
				{
					DataCache.Instance.Countries = DataFacade.Instance.GetCountries();
				}

				return DataCache.Instance.Countries;
			}
		}

		public List<Community> Communities
		{
			get
			{
				if (DataCache.Instance.Communities == null)
				{
					DataCache.Instance.Communities = DataFacade.Instance.GetCommunities();
				}

				return DataCache.Instance.Communities;
			}
		}

		void ShowMentorControls(bool show)
		{
			Visibility visible = (show) ? Visibility.Visible : Visibility.Collapsed;
			mentorAreasPanel.Visibility = visible;
			bioEditor.Visibility = visible;
		}

		void ShowMenteeControls(bool show)
		{
			menteeAreasPanel.Visibility = (menteeToggle.IsOn) ? Visibility.Visible : Visibility.Collapsed;
		}

		private async void attchmentSelectButton_Click(object sender, RoutedEventArgs e)
		{
            
			FileOpenPicker openPicker = new FileOpenPicker();
			openPicker.ViewMode = PickerViewMode.List;
			openPicker.SuggestedStartLocation = PickerLocationId.DocumentsLibrary;
			openPicker.FileTypeFilter.Add("*");
			IReadOnlyList<StorageFile> files = await openPicker.PickMultipleFilesAsync();
			if (files.Count > 0)
			{
				
			}			
		}

		private void menteeToggle_Toggled(object sender, RoutedEventArgs e)
		{
			ShowMenteeControls(menteeToggle.IsOn);
		}

		private void mentorToggle_Toggled(object sender, RoutedEventArgs e)
		{
			ShowMentorControls(mentorToggle.IsOn);
		}
	}
}
